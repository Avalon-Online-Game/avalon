import random
from django.core.cache import cache

from .state import GameState
from . import db_utils as db


class MessageHandler:
    def __init__(self, consumer):
        self.consumer = consumer

    async def leave(self, payload=None, game_code=None, game_state=None):
        """
        Called by receive_json when someone sent a leave command.
        """
        await db.remove_channel_name(self.consumer.scope['user'])

        game_code = self.consumer.game.code
        player = self.consumer.scope['user']

        game_state = cache.get(game_code)
        if game_state is not None:
            await self.consumer.channel_layer.group_send(
                game_code,
                {
                    'type': 'game.leave',
                    'player': {'token': player.token, 'username': player.user.username, 'avatar': player.user.avatar},
                }
            )

        await db.delete_player(player.token)
        if self.consumer.game.creator.id == player.user.id:
            await db.delete_game(game_code)
            await self.consumer.channel_layer.group_send(
                game_code,
                {
                    'type': 'game.leave',
                    'player': {'token': player.token, 'username': player.user.username, 'avatar': player.user.avatar},
                }
            )
        await self.consumer.close()

    async def start(self):
        game_code = self.consumer.game.code
        game_state = cache.get(game_code)

        if game_state is None:
            players = await db.get_players(game_code)
            roles = list(self.consumer.game.roles.all())
            random.shuffle(roles)
            random.shuffle(players)
            await db.set_players_roles(zip(players, roles))

            game_state = GameState(game_code, players)
            cache.set(game_state.game, game_state)
        await self.consumer.channel_layer.group_send(
            game_code,
            {
                'type': 'game.start',
                'game': game_code,
            }
        )

    async def quest_choice(self, payload, game_state, game_code):
        """
        content:
            msg_type: quest_choice
            players: players chosen for the quest by commander:
                    {'token': player_token, 'username': player_username, 'avatar': player_user_avatar}
        """
        chosen_players = payload.get('players')
        game_state.set_voting_state(chosen_players)
        cache.set(game_state.game, game_state)

        await self.consumer.channel_layer.group_send(
            game_code,
            {
                'type': 'game.quest_choice',
                'game_state': game_state.to_json(),
            },
        )

    async def quest_vote(self, payload, game_code, game_state):
        """
        content:
            msg_type: quest_vote
            vote: approve or reject
        """
        vote = payload.get('vote')
        player = self.consumer.scope['user']
        current_quest = game_state.quests[game_state.current_quest_number - 1]
        current_quest.vote(player, vote)
        game_state.add_voted_player(player)
        game_state.update_current_quest(current_quest)
        await self.consumer.channel_layer.group_send(
            game_code,
            {
                'type': 'game.quest_vote',
                'player': {'token': player.token, 'username': player.user.username, 'avatar': player.user.avatar},
                'game_state': game_state.to_json(),
            },
        )

        if current_quest.is_vote_complete(game_state):
            vote_result = current_quest.collect_votes_result()
            game_state.quest_votes = current_quest.votes
            game_state.quest_voting_result = vote_result
            if vote_result == 'approve':
                current_quest.set_quest_players(game_state)
                game_state.update_current_quest(current_quest)
                game_state.set_quest_state()
            else:
                current_quest.votes = []
                game_state.update_current_quest(current_quest)
                game_state.set_failed_voting_state()

            await self.consumer.channel_layer.group_send(
                game_code,
                {
                    'type': 'game.quest_vote_result',
                    'game_state': game_state.to_json(),
                },
            )
            game_state.clear_voting_state()

        cache.set(game_state.game, game_state)

    async def quest(self, payload, game_code, game_state):
        """
        content:
            msg_type: quest
            score: success or fail
        """
        current_quest = game_state.quests[game_state.current_quest_number - 1]
        quest_player = self.consumer.scope['user']
        score = payload.get('score')
        current_quest.set_score(score)
        game_state.add_scored_player(quest_player)
        # Check if quest is done and quest_result must be sent
        if sum(current_quest.scores.values()) == current_quest.players_number:
            current_quest.set_result()
            game_state.update_current_quest(current_quest)
            game_state.set_next_quest_state()

            await self.consumer.channel_layer.group_send(
                game_code,
                {
                    'type': 'game.quest_result',
                    'game_state': game_state.to_json(),
                },
            )

            if game_state.get_game_result():
                # Check if game is ended
                if game_state.state == 'end':
                    players_roles = [(player, role.name) for player, role in game_state.players_roles]
                    await self.consumer.channel_layer.group_send(
                        game_code,
                        {
                            'type': 'game.end',
                            'players_roles': players_roles,
                            'game_state': game_state.to_json(),
                        },
                    )
                # Check if game is in assassination state
                if game_state.state == 'assassination':
                    assassination_choices = [player for player, role in game_state.players_roles if role.side == 'good']
                    await self.consumer.channel_layer.group_send(
                        game_code,
                        {
                            'type': 'game.assassination',
                            'assassination_choices': assassination_choices,
                            'game_state': game_state.to_json(),
                        },
                    )
            game_state.clear_quest_state()
        # Update quests and game state
        else:
            game_state.update_current_quest(current_quest)
            await self.consumer.channel_layer.group_send(
                game_code,
                {
                    'type': 'game.quest_score',
                    'player': {'token': quest_player.token, 'username': quest_player.user.username,
                               'avatar': quest_player.user.avatar},
                    'scored_players': game_state.quest_scored_players,
                },
            )

        cache.set(game_state.game, game_state)

    async def assassination(self, payload, game_code, game_state):
        """
        content:
            msg_type: assassination
            merlin_choice: {'token': player_token, 'username': player_username, 'avatar': player_user_avatar}
        """
        merlin_choice = payload.get('merlin_choice')
        chosen_player_role = next(((player, role) for player, role in game_state.players_roles if
                                   player == merlin_choice), None)
        # Assassination result
        assassination_result = game_state.assassinate(chosen_player_role)
        await self.consumer.channel_layer.group_send(
            game_code,
            {
                'type': 'game.assassination_result',
                'assassination_result': assassination_result,
                'assassinated_player': chosen_player_role[0],
                'game_state': game_state.to_json(),
            },
        )
        # End game
        players_roles = [(player, role.name) for player, role in game_state.players_roles]
        await self.consumer.channel_layer.group_send(
            game_code,
            {
                'type': 'game.end',
                'players_roles': players_roles,
                'game_state': game_state.to_json(),
            },
        )
        cache.set(game_state.game, game_state)

    async def update_state(self, payload, game_code, game_state):
        await self.consumer.channel_layer.send(
            self.consumer.channel_name,
            {
                'type': 'game.update_state',
                'game_state': game_state.to_json(),
            },
        )
