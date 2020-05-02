import json
import logging
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
import avalon.utils as cache
from channels.db import database_sync_to_async

from players.models import Player
from .state import GameState, Quest
from . import state
from .utils import (
    get_game,
    start_game,
    get_players,
    set_channel_name,
    remove_channel_name,
)
from .exceptions import ClientError

log = logging.getLogger(__name__)


class PlayerConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        if self.scope['user'] is AnonymousUser:
            return await self.close()
        else:
            await self.accept()

        game = await get_game(self.scope['user'])

        await self.channel_layer.group_add(
            game.code,
            self.channel_name,
        )

        await set_channel_name(self.scope['user'], self.channel_name)        

        if await start_game(self.scope['user'], game):
            players = await get_players(game.code)
            for player in players:
                await self.channel_layer.send(
                    player.channel_name,
                    {
                        'type': 'game.start',
                        'game_code': game.code,
                        'player_token': player.token,
                    }
                )

        self.game = game.code


    async def receive_json(self, content):
        """
        Called when we get a text frame. Channels will JSON-decode the payload
        for us and pass it as the first argument.
        """
        msg_type = content.get('msg_type', None)
        try:
            # if command == "commander":
            #     await self.commander(content["game_code"])

            if msg_type == 'quest_choice':
                await self.quest_choice(content['game'], content['players'])

            elif msg_type == 'quest_vote':
                await self.quest_vote(content)

            elif msg_type == 'quest_result':
                await self.quest_result(content)
            
            elif msg_type == 'leave':
                await self.leave(content['game'])

        except ClientError as e:
            await self.send_json({'error': e.code})


    async def disconnect(self, code):
        try:
            if self.scope['user'] is AnonymousUser:
                return
            
            await remove_channel_name(self.scope['user'])
            
            game = await get_game(self.scope['user'])

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


    # async def commander(self, game_code):
    #     await self.channel_layer.group_send(
    #             game_code,
    #             {
    #                 "type": "game.commander",
    #                 "game_code": game_code,
    #             }
    #         )

    async def quest_choice(self, game_code, players):
        await self.channel_layer.group_send(
                game_code,
                {
                    'type': 'game.quest_choice',
                    'game_code': game_code,
                    'players': players,
                }
            )


    async def quest_vote(self, content):
        game = await get_game(content['game_code'])
        await self.channel_layer.group_send(
                game.code,
                {
                    'type': 'game.quest_vote_result',
                }
            )

        
    async def quest_result(self, content):
        game = await get_game(content['game_code'])
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

        await remove_channel_name(self.scope['user'])

        game = await get_game(self.scope['user'])

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


##### Handlers for messages sent over the channel layer
    # These helper methods are named by the types we send - so game.start becomes game_start
    async def game_start(self, event):
        """
        Called when all players have joined the game.
        event : (game, player, player_role)
        """

        game_state = cache.get_value(event['game_code'])

        if game_state is None:
            # Create GameState
            players = await get_players(event['game_code'])
            game_state = GameState(event['game_code'], players)
            cache.set_value(game_state.game, game_state)
        
        # Create customized response for each player
        json = {
                'msg_type': state.MSG_TYPE_START,
                'game_state': game_state.to_json(),
                'player_state': game_state.get_player_data(event['player_token'])
        }

        # Send a message down to the client
        await self.send_json(
            json,
        )


    # async def game_commander(self, event):
    #     """
    #     Send commander for the current quest.
    #     """
    #     json = {
    #             "msg_type": state.MSG_TYPE_COMMANDER,
    #     }
    
    #     game_state = cache.get_value(event["game_code"])
    #     game_state.get_next_commander()
    #     json.update(game_state.to_json())
    #     cache.update_value(event["game_code"], game_state)
        
    #     await self.send_json(
    #         json,
    #     )

    async def game_quest_choice(self, event):
        """
        Send commander's chosen players for the current quest.
        """
        game_state = cache.get_value(event['game_code'])
        quest_players = event['players']
        if all(quest_player in game_state.players for quest_player in quest_players):
            await self.send_json(
                {
                    'msg_type': state.MSG_TYPE_QUEST_CHOICE,
                    'players': quest_players
                },
            )

    async def game_quest_vote_result(self, event):
        """
        Send players votes for the current quest.
        """
        await self.send_json(
            {
                'msg_type': state.MSG_TYPE_QUEST_VOTE_RESULT,
            },
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
