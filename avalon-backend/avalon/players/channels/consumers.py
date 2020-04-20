import json
import logging
from games.channels import utils
from channels.consumer import SyncConsumer
from channels.generic.websocket import AsyncWebsocketConsumer, AsyncJsonWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from games.channels.utils import GameState, Quest
import avalon.utils as cache
from .utils import get_game_or_error, start_game_or_wait, get_players_or_error
from .exceptions import ClientError

log = logging.getLogger(__name__)


class PlayerConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        # Are they logged in?
        if self.scope["user"] is AnonymousUser:
            # Reject the connection
            await self.close()
        else:
            # Accept the connection
            await self.accept()
        
        game = await get_game_or_error(self.scope["user"])
        print("user is :", self.scope['user'])

        # Add player to the game group
        await self.channel_layer.group_add(
            game.code,
            self.channel_name,
        )

        # Add player to their exclusive group
        await self.channel_layer.group_add(
            self.scope["user"].token,
            self.channel_name
        )

        start_game = await start_game_or_wait(self.scope["user"], game)

        # Send each player's role if all players have joined
        if start_game:
            await self.channel_layer.group_send(
                self.scope["user"].token,
                {
                    "type": "game.start",
                    "game_code": game.code,
                    "player_token": self.scope["user"].token,
                }
            )

        self.game = game.code


    async def receive_json(self, content):
        """
        Called when we get a text frame. Channels will JSON-decode the payload
        for us and pass it as the first argument.
        """
        # Messages will have a "command" key we can switch on
        command = content.get("command", None)
        try:
            # Return the commander of the quest
            if command == "commander":
                await self.commander(content["game_code"])

            # Recieve the mission players
            elif command == "quest_choice":
                await self.quest_choice(content["game_code"], content["players"])

            # Recieve approve/reject votes for the quest
            elif command == "quest_vote":
                await self.quest_vote(content)

            # Recieve success/fail votes and Return quest result
            elif command == "quest_result":
                await self.quest_result(content)
            
            elif command == "leave":
                await self.leave(content["game_code"])

        except ClientError as e:
            # Catch any errors and send it back
            await self.send_json({"error": e.code})


    async def disconnect(self, code):
        # Leave game
        try:
            await self.leave(self.game)
        except ClientError:
            pass


    async def commander(self, game_code):
        await self.channel_layer.group_send(
                game_code,
                {
                    "type": "game.commander",
                    "game_code": game_code,
                }
            )

    async def quest_choice(self, game_code, players):
        await self.channel_layer.group_send(
                game_code,
                {
                    "type": "game.quest_choice",
                    "game_code": game_code,
                    "players": players,
                }
            )


    async def quest_vote(self, content):
        game = await get_game_or_error(content["game_code"])
        await self.channel_layer.group_send(
                game.code,
                {
                    "type": "game.quest_vote",
                }
            )

        
    async def quest_result(self, content):
        game = await get_game_or_error(content["game_code"])
        await self.channel_layer.group_send(
                game.code,
                {
                    "type": "game.quest_result",
                }
            )


    async def leave(self, game_code):
        """
        Called by receive_json when someone sent a leave command.
        """
        game = await get_game_or_error(self.scope["user"])

        await self.channel_layer.group_send(
                game.code,
                {
                    "type": "game.leave",
                    "game": game.code,
                    "player": self.scope["user"].token,
                }
            )

        # Remove them from the game 
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
        # Create GameState
        players, goods, evils = await get_players_or_error(event["game_code"])
        game_state = GameState(event["game_code"], players, goods, evils)
        cache.set_value(game_state.game, game_state)

        # Create customized response for each player
        json = {
                "msg_type": settings.MSG_TYPE_START,
                "game": event["game_code"],
                "player": event["player_token"],
                }

        json.update(game_state.to_json())
        json.update(game_state.get_player_response(event['player_token']))
        print(json)
        # Send a message down to the client
        await self.send_json(
            json,
        )


    async def game_commander(self, event):
        """
        Send commander for the current quest.
        """
        json = {
                "msg_type": settings.MSG_TYPE_COMMANDER,
                }
    
        game_state = cache.get_value(event["game_code"])
        game_state.get_next_commander()
        json.update(game_state.to_json())
        cache.update_value(event["game_code"], game_state)
        
        await self.send_json(
            json,
        )

    async def game_quest_choice(self, event):
        """
        Send commander's chosen players for the current quest.
        """
        await self.send_json(
            {
                "msg_type": settings.MSG_TYPE_QUEST_CHOICE,
            },
        )

    async def game_quest_vote(self, event):
        """
        Send players votes for the current quest.
        """
        await self.send_json(
            {
                "msg_type": settings.MSG_TYPE_QUEST_VOTE,
            },
        )

    async def game_quest_result(self, event):
        """
        Send result of the current quest.
        """
        await self.send_json(
            {
                "msg_type": settings.MSG_TYPE_QUEST_RESULT,
            },
        )

    async def game_end(self, event):
        """
        Send winner of the game.
        """
        await self.send_json(
            {
                "msg_type": settings.MSG_TYPE_END,
            },
        )

    async def game_leave(self, event):
        """
        Notify others someome has left the game.
        """
        await self.send_json(
            {
                "msg_type": settings.MSG_TYPE_LEAVE,
                "game_code": event["game"],
                "player_token": event["player"],
            },
        )