import json
import logging
import random
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
# import avalon.utils as cache
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

        if await db_utils.start_game(self.scope['user'], game):
            await self.start_state(game)


    async def disconnect(self, code):
        try:
            if self.scope['user'] is AnonymousUser:
                return
            
            await db_utils.remove_channel_name(self.scope['user'])
            
            game = await db_utils.get_game(self.scope['user'])

            await self.channel_layer.group_send(
                game.code,
                {
                    'type': 'game.disconnect',
                    'game': game.code,
                    'player': self.scope['user'].token,
                }
            )

            await self.channel_layer.group_discard(
                game.code,
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

            elif msg_type == 'quest_result':
                await self.quest_result(content)
            
            elif msg_type == 'leave':
                await self.leave(content['game'])

        except ClientError as e:
            await self.send_json({'error': e.code})


    async def start_state(self, game):
        game_code = game.code
        game_state = cache.get(game_code)

        if game_state is None:
            players = await db_utils.get_players(game_code)
            roles = list(game.roles.all())
            random.shuffle(roles)
            random.shuffle(players)
            db_utils.set_players_roles(zip(players, roles))

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
        game_code = content['game']
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
                'players': chosen_players,
                'commander': game_state.commander,
                'game_state': game_state.to_json(),
            },
        )


    async def quest_vote(self, content):
        game_code = content['game']
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
        game_state.update_current_quest(current_quest)
        cache.set(game_state.game, game_state)
        await self.channel_layer.group_send(
            game_code,
            {
                'type': 'game.quest_vote',
                'quest_players': game_state.current_quest_candidates,
                'player': {'token': player.token, 'username': player.user.username, 'avatar': player.user.avatar},
                'game_state': game_state.to_json(),
            },
        )

        if current_quest.is_vote_complete(game_state):
            vote_result = current_quest.collect_votes_result()
            if vote_result == 'approve':
                current_quest.set_quest_players(game_state)
                game_state.update_current_quest(current_quest)
                game_state.set_quest_state()
            else:
                current_quest.votes = []
                game_state.update_current_quest(current_quest)
                game_state.set_failed_voting_state()

            cache.set(game_state.game, game_state)
            await self.channel_layer.group_send(
                game_code,
                {
                    'type': 'game.quest_vote_result',
                    'quest_players': game_state.current_quest_candidates,
                    'players_vote': current_quest.votes,
                    'voting_result': vote_result,
                    'game_state': game_state.to_json(),
                },
            )


    async def update_state(self, content):
        game_code = content['game']
        game_state = cache.get(game_code)

        await self.channel_layer.send(
            self.channel_name,
            {
                'type': 'game.update_state',
                'game_state': game_state.to_json(),
            },
        )


    async def quest_result(self, content):
        game = await db_utils.get_game(content['game_code'])
        await self.channel_layer.group_send(
                game.code,
                {
                    'type': 'game.quest_result',
                }
            )


    async def leave(self, game_code):
        """
        Called by receive_json when someone sent a leave command.
        """
        if self.scope['user'] is AnonymousUser:
            return

        await db_utils.remove_channel_name(self.scope['user'])

        game = await db_utils.get_game(self.scope['user'])

        await self.channel_layer.group_send(
                game.code,
                {
                    'type': 'game.leave',
                    'game': game.code,
                    'player': self.scope['user'].token,

                }
            )

        await self.channel_layer.group_discard(
            game.code,
            self.channel_name,
        )


##### Handlers for messages sent over the channel layer #####
    async def game_start(self, event):
        """
        Called when all players have joined the game.
        event: (game_state, )
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
                'quest_players': event['players'],
                'commander': event['commander'],
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
                'quest_players': event['quest_players'],
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
                'quest_players': event['quest_players'],
                'players_vote': event['players_vote'],
                'voting_result': event['voting_result'],
                'game_state': event['game_state'],
            }
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
            


    async def game_quest_result(self, event):
        """
        Send result of the current quest.
        """
        await self.send_json(
            {
                "msg_type": state.MSG_TYPE_QUEST_RESULT,
            },
        )

    async def game_end(self, event):
        """
        Send winner of the game.
        """
        await self.send_json(
            {
                "msg_type": state.MSG_TYPE_END,
            },
        )

    async def game_leave(self, event):
        """
        Notify others someome has left the game.
        """
        await self.send_json(
            {
                "msg_type": state.MSG_TYPE_LEAVE,
                "game_code": event["game"],
                "player_token": event["player"],
            },
        )

    async def game_disconnect(self, event):
        """
        Notify others someome has disconnected game.
        """
        await self.send_json(
            {
                "msg_type": state.MSG_TYPE_DISCONNECT,
                "game_code": event["game"],
                "player_token": event["player"],
            },
        )
