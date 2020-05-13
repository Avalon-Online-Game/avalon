import json
import logging
import random
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from django.core.cache import cache

from players.models import Player
from .state import GameState, Quest
from .exceptions import ClientError
from . import db_utils
from . import state

log = logging.getLogger(__name__)


class PlayerConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        if self.scope['user'] is AnonymousUser:
            return await self.close()
        else:
            await self.accept()
        game = await db_utils.get_game(self.scope['user'])

        await self.channel_layer.group_add(
            game.code,
            self.channel_name,
        )

        await db_utils.set_channel_name(self.scope['user'], self.channel_name)
        self.game = game
        if await db_utils.start_game(self.scope['user'], game):
            await self.start_state()
        


    async def disconnect(self, code):
        try:
            if self.scope['user'] is AnonymousUser:
                return
            
            await db_utils.remove_channel_name(self.scope['user'])
            
            game_code = self.game.code
            player = self.scope['user']
            await self.channel_layer.group_send(
                game_code,
                {
                    'type': 'game.disconnect',
                    'player': {'token': player.token, 'username': player.user.username, 'avatar': player.user.avatar},
                }
            )

            await self.channel_layer.group_discard(
                game_code,
                self.channel_name,
            )

        except:
            pass


    async def receive_json(self, content):
        """
        Called when we get a text frame. Channels will JSON-decode the payload
        for us and pass it as the first argument.
        """
        msg_type = content.get('msg_type', None)
        try:
            if msg_type == 'quest_choice':
                await self.quest_choice(content)

            elif msg_type == 'quest_vote':
                await self.quest_vote(content)

            elif msg_type == 'update_state':
                await self.update_state(content)

            elif msg_type == 'quest':
                await self.quest(content)

            elif msg_type == 'assassination':
                await self.assassination(content)
            
            elif msg_type == 'leave':
                await self.leave(content)

        except ClientError as e:
            await self.send_json({'error': e.code})


    async def start_state(self):
        game_code = self.game.code
        game_state = cache.get(game_code)

        if game_state is None:
            players = await db_utils.get_players(game_code)
            roles = list(self.game.roles.all())
            random.shuffle(roles)
            random.shuffle(players)
            await db_utils.set_players_roles(zip(players, roles))

            game_state = GameState(game_code, players)
            cache.set(game_state.game, game_state)
        await self.channel_layer.group_send(
                game_code,
                {
                    'type': 'game.start',
                    'game': game_code,
                }
            )


    async def quest_choice(self, content):
        """
        content:
            msg_type: quest_choice
            players: players chosen for the quest by commander: 
                    {'token': player_token, 'username': player_username, 'avatar': player_user_avatar}
        """

        game_code = self.game.code
        game_state = cache.get(game_code)
        
        if game_state == None:
            return await self.send_json(
                {
                    'error': 'game is not started'
                },
            )

        if game_state.commander['token'] != self.scope['user'].token:
            return await self.send_json(
                {
                    'error': 'only commander can choose players for doing quest'
                },
            )

        chosen_players = content['players']
        current_quest = game_state.quests[game_state.current_quest_number - 1]

        if len(chosen_players) != current_quest.players_number:
            return await self.send_json(
                {
                    'error': 'not correct number of players has been chosen for the quest'
                },
            )

        if not all(quest_player in game_state.players for quest_player in chosen_players):
            return await self.send_json(
                {
                    'error': 'players chosen for the quest are invalid'
                },
            )

        game_state.set_voting_state(chosen_players)
        cache.set(game_state.game, game_state)
        
        await self.channel_layer.group_send(
            game_code,
            {
                'type': 'game.quest_choice',
                'game_state': game_state.to_json(),
            },
        )


    async def quest_vote(self, content):
        """
        content:
            msg_type: quest_vote
            vote: approve or reject
        """

        game_code = self.game.code
        vote = content['vote']
        game_state = cache.get(game_code)

        if game_state == None:
            return await self.send_json(
                {
                    'error': 'game is not started'
                },
            )

        if game_state.state != 'voting':
            return await self.send_json(
                {
                    'error': 'game is not in voting state',
                }
            )

        if vote != 'approve' and vote != 'reject':
            return await self.send_json(
                {
                    'error': 'vote is not valid',
                }
            )

        current_quest = game_state.quests[game_state.current_quest_number - 1]
        player = self.scope['user']
        if len(current_quest.votes) == game_state.number_of_players:
            return await self.send_json(
                {
                    'error': 'all the players has already voted',
                }
            ),

        if next((player_vote for player_vote in current_quest.votes if \
                player_vote[0]['token'] == player.token), None) is not None:
            return await self.send_json(
                {
                    'error': 'player has already voted',
                }
            ),

        current_quest.vote(player, vote)
        game_state.add_voted_player(player)
        game_state.update_current_quest(current_quest)
        await self.channel_layer.group_send(
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

            await self.channel_layer.group_send(
                game_code,
                {
                    'type': 'game.quest_vote_result',
                    'game_state': game_state.to_json(),
                },
            )
            game_state.clear_voting_state()
        
        cache.set(game_state.game, game_state)


    async def quest(self, content):
        """
        content:
            msg_type: quest
            score: success or fail
        """
        
        game_code = self.game.code
        game_state = cache.get(game_code)

        if game_state == None:
            return await self.send_json(
                {
                    'error': 'game is not started'
                },
            )

        if game_state.state != 'quest':
            return await self.send_json(
                {
                    'error': 'game is not in quest state',
                }
            )

        current_quest = game_state.quests[game_state.current_quest_number - 1]
        if sum(current_quest.scores.values()) == current_quest.players_number:
            return await self.send_json(
                {
                    'error': 'all current quest players has already scored'
                },
            )

        quest_player = self.scope['user']
        if not quest_player.token in [player['token'] for player in current_quest.players]:
            return await self.send_json(
                {
                    'error': 'player is not in current quest players'
                },
            )

        if quest_player.token in [player['token'] for player in game_state.quest_scored_players]:
            return await self.send_json(
                {
                    'error': 'player has already scored the quest'
                },
            )

        score = content['score']
        current_quest.set_score(score)
        game_state.add_scored_player(quest_player)
        if sum(current_quest.scores.values()) == current_quest.players_number:
            current_quest.set_result()
            game_state.update_current_quest(current_quest)
            game_state.set_next_quest_state()

            await self.channel_layer.group_send(
                game_code,
                {
                    'type': 'game.quest_result',
                    'game_state': game_state.to_json(),
                },
            )
        
            if game_state.get_game_result():
                if game_state.state == 'end':
                    players_roles = [(player, role.name) for player, role in game_state.players_roles]
                    await self.channel_layer.group_send(
                        game_code,
                        {
                            'type': 'game.end',
                            'players_roles': players_roles,
                            'game_state': game_state.to_json(),
                        },
                    )
                if game_state.state == 'assassination':
                    assassination_choices = [player for player, role in game_state.players_roles if role.side == 'good']
                    await self.channel_layer.group_send(
                        game_code,
                        {
                            'type': 'game.assassination',
                            'assassination_choices': assassination_choices,
                            'game_state': game_state.to_json(),
                        },
                    )
            game_state.clear_quest_state()
        else:
            game_state.update_current_quest(current_quest)

        cache.set(game_state.game, game_state)

    async def assassination(self, content):
        """
        content:
            msg_type: assassination
            merlin_choice: {'token': player_token, 'username': player_username, 'avatar': player_user_avatar}
        """
        
        game_code = self.game.code
        game_state = cache.get(game_code)

        if game_state == None:
            return await self.send_json(
                {
                    'error': 'game is not started'
                },
            )

        if game_state.state != 'assassination':
            return await self.send_json(
                {
                    'error': 'game is not in assassination state',
                }
            )

        player = self.scope['user']
        if player.role.name != 'assassin':
            return await self.send_json(
                {
                    'error': 'player role is not assassin',
                }
            )
        
        merlin_choice = content['merlin_choice']
        chosen_player_role = next(((player, role) for player, role in game_state.players_roles if \
                               player == merlin_choice), None)

        if chosen_player_role == None:
            return await self.send_json(
                {
                    'error': 'chosen player is not valid',
                }
            )
        
        assassination_result = game_state.assassinate(chosen_player_role)
        await self.channel_layer.group_send(
            game_code,
            {
                'type': 'game.assassination_result',
                'assassination_result': assassination_result,
                'assassinated_player': chosen_player_role[0],
                'game_state': game_state.to_json(),
            },
        )
        players_roles = [(player, role.name) for player, role in game_state.players_roles]
        await self.channel_layer.group_send(
            game_code,
            {
                'type': 'game.end',
                'players_roles': players_roles,
                'game_state': game_state.to_json(),
            },
        )
        cache.set(game_state.game, game_state)


    async def update_state(self, content):
        game_code = self.game.code
        game_state = cache.get(game_code)

        await self.channel_layer.send(
            self.channel_name,
            {
                'type': 'game.update_state',
                'game_state': game_state.to_json(),
            },
        )


    async def leave(self, game_code):
        """
        Called by receive_json when someone sent a leave command.
        """
        if self.scope['user'] is AnonymousUser:
            return

        await db_utils.remove_channel_name(self.scope['user'])

        game_code = self.game.code
        player = self.scope['user']
        await self.channel_layer.group_send(
                game.code,
                {
                    'type': 'game.leave',
                    'player': {'token': player.token, 'username': player.user.username, 'avatar': player.user.avatar},
                }
            )

        await self.channel_layer.group_discard(
            game_code,
            self.channel_name,
        )


##### Handlers for messages sent over the channel layer #####
    async def game_start(self, event):
        """
        Called when all players have joined the game.
        event:
            game: game code
        """
        game_state = cache.get(event['game'])
        await self.send_json(
            {
                'msg_type': state.MSG_TYPE_START,
                'game_state': game_state.to_json(),
                'player': game_state.get_player_data(self.scope['user'].token),
            },
        )


    async def game_quest_choice(self, event):
        """
        Send commander's chosen players for the current quest.
        """
        await self.send_json(
            {
                'msg_type': state.MSG_TYPE_QUEST_CHOICE,
                'game_state': event['game_state'],
            },
        )
        

    async def game_quest_vote(self, event):
        """
        Send players vote of a player.
        """
        await self.send_json(
            {
                'msg_type': state.MSG_TYPE_QUEST_VOTE,
                'voted_player': event['player'],
                'game_state': event['game_state'],
            }
        )


    async def game_quest_vote_result(self, event):
        """
        Send players voteing result.
        """
        await self.send_json(
            {
                'msg_type': state.MSG_TYPE_QUEST_VOTE_RESULT,
                'game_state': event['game_state'],
            }
        )


    async def game_quest_result(self, event):
        """
        Send result of the current quest.
        """
        await self.send_json(
            {
                'msg_type': state.MSG_TYPE_QUEST_RESULT,
                'game_state': event['game_state'],
            },
        )

    
    async def game_update_state(self, event):
        """
        Send players complete game state.
        """
        await self.send_json(
            {
                'msg_type': state.MSG_TYPE_UPDATE,
                'game_state': event['game_state'],
            }
        )


    async def game_assassination(self, event):
        """
        Send assassination state.
        """
        await self.send_json(
            {
                'msg_type': state.MSG_TYPE_ASSASSINATION,
                'assassination_choices': event['assassination_choices'],
                'game_state': event['game_state'],
            },
        )

    async def game_assassination_result(self, event):
        """
        Send assassination result and end of the game state.
        """
        await self.send_json(
            {
                'msg_type': state.MSG_TYPE_ASSASSINATION_RESULT,
                'assassination_result': event['assassination_result'],
                'assassinated_player': event['assassinated_player'],
                'game_state': event['game_state'],
            },
        )

    async def game_end(self, event):
        """
        Send end of the game state.
        """
        await self.send_json(
            {
                'msg_type': state.MSG_TYPE_END,
                'players_roles': event['players_roles'],
                'game_state': event['game_state'],
            },
        )


    async def game_leave(self, event):
        """
        Notify others someome has left the game.
        """
        await self.send_json(
            {
                'msg_type': state.MSG_TYPE_LEAVE,
                'player': event['player'],
            },
        )


    async def game_disconnect(self, event):
        """
        Notify others someome has disconnected game.
        """
        await self.send_json(
            {
                'msg_type': state.MSG_TYPE_DISCONNECT,
                'player': event['player'],
            },
        )
