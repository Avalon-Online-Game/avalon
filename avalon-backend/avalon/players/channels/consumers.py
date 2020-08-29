import logging
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from django.core.cache import cache

from . import db_utils as db
from .managers import MessageManager
from . import messages

log = logging.getLogger(__name__)


class PlayerConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        if self.scope['user'] is AnonymousUser:
            return await self.close()
        await self.accept()
        self.message_manager = MessageManager(consumer=self)
        self.game = await db.get_game(self.scope['user'])
        await self.channel_layer.group_add(
            self.game.code,
            self.channel_name,
        )
        await db.set_channel_name(self.scope['user'], self.channel_name)
        if await db.start_game(self.scope['user'], self.game):
            await self.message_manager.handler.start()

    async def disconnect(self, code):
        try:
            if self.scope['user'] is AnonymousUser:
                return

            await db.remove_channel_name(self.scope['user'])

            game_code = self.game.code
            player = self.scope['user']

            await self.channel_layer.group_send(
                game_code,
                {
                    'type': 'game.disconnect',
                    'player': {'token': player.token, 'username': player.user.username, 'avatar': player.user.avatar},
                }
            )
        except:
            pass

    async def receive_json(self, payload):
        """
        Called when we get a text frame. Channels will JSON-decode the payload
        for us and pass it as the first argument.
        """
        await self.message_manager.bind(payload)

# Handlers for messages sent over the channel layer
    async def game_start(self, event):
        """
        Called when all players have joined the game.
        event:
            game: game code
        """
        game_state = cache.get(event['game'])
        await self.send_json(
            {
                'msg_type': messages.MessageTypes.START,
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
                'msg_type': messages.MessageTypes.QUEST_CHOICE,
                'game_state': event['game_state'],
            },
        )

    async def game_quest_vote(self, event):
        """
        Send players vote of a player.
        """
        await self.send_json(
            {
                'msg_type': messages.MessageTypes.QUEST_VOTE,
                'voted_player': event['player'],
                'game_state': event['game_state'],
            }
        )

    async def game_quest_vote_result(self, event):
        """
        Send players voting result.
        """
        await self.send_json(
            {
                'msg_type': messages.MessageTypes.QUEST_VOTE_RESULT,
                'game_state': event['game_state'],
            }
        )

    async def game_quest_score(self, event):
        """
        Send players list of players who has scored.
        """
        await self.send_json(
            {
                'msg_type': messages.MessageTypes.QUEST_SCORE,
                'player': event['player'],
                'quest_scored_players': event['quest_scored_players'],
            }
        )

    async def game_quest_result(self, event):
        """
        Send result of the current quest.
        """
        await self.send_json(
            {
                'msg_type': messages.MessageTypes.QUEST_RESULT,
                'game_state': event['game_state'],
            },
        )

    async def game_update_state(self, event):
        """
        Send players complete game state.
        """
        await self.send_json(
            {
                'msg_type': messages.MessageTypes.UPDATE,
                'game_state': event['game_state'],
            }
        )

    async def game_assassination(self, event):
        """
        Send assassination state.
        """
        await self.send_json(
            {
                'msg_type': messages.MessageTypes.ASSASSINATION,
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
                'msg_type': messages.MessageTypes.ASSASSINATION_RESULT,
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
                'msg_type': messages.MessageTypes.END,
                'players_roles': event['players_roles'],
                'game_state': event['game_state'],
            },
        )

    async def game_leave(self, event):
        """
        Notify others that someone has left the game.
        """
        await self.send_json(
            {
                'msg_type': messages.MessageTypes.LEAVE,
                'player': event['player'],
            },
        )

    async def game_disconnect(self, event):
        """
        Notify others that someone has disconnected game.
        """
        await self.send_json(
            {
                'msg_type': messages.MessageTypes.DISCONNECT,
                'player': event['player'],
            },
        )
