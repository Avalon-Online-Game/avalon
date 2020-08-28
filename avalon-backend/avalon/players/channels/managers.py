from django.core.cache import cache

from .handlers import MessageHandler
from . import messages
from . import validators


async def send_error_message(consumer, error):
    return await consumer.send_json(
        {
            'error': error
        },
    )


class MessageManager:
    def __init__(self, consumer):
        self.consumer = consumer
        self.handler = MessageHandler(self.consumer)
        self.msg_type = None
        self.msg_handler = None
        self.ws_handler = None

    async def bind(self, payload):
        self.msg_type = self.get_msg_type(payload)
        game_code = self.consumer.game.code
        game_state = cache.get(game_code)
        if not await self.validate(payload, game_code, game_state):
            return
        self.msg_handler = self.get_msg_handler()
        await self.msg_handler(payload=payload, game_code=game_code, game_state=game_state)

    def get_msg_type(self, payload):
        msg_type = payload.get('msg_type')
        if msg_type is None:
            return send_error_message(self.consumer, messages.ErrorMessage.BAD_REQUEST)
        return msg_type

    async def validate(self, payload, game_code, game_state):
        msg_validator_class = validators.msg_type_to_validator[self.msg_type]
        msg_validator = msg_validator_class(consumer=self.consumer, payload=payload, game_code=game_code,
                                            game_state=game_state)
        return await msg_validator.validate()

    def get_msg_handler(self):
        if self.msg_type == messages.MessageTypes.QUEST_CHOICE:
            return self.handler.quest_choice

        elif self.msg_type == messages.MessageTypes.QUEST_VOTE:
            return self.handler.quest_vote

        elif self.msg_type == messages.MessageTypes.UPDATE_STATE:
            return self.handler.update_state

        elif self.msg_type == messages.MessageTypes.QUEST:
            return self.handler.quest

        elif self.msg_type == messages.MessageTypes.ASSASSINATION:
            return self.handler.assassination

        elif self.msg_type == messages.MessageTypes.LEAVE:
            return self.handler.leave

        return send_error_message(self.consumer, messages.ErrorMessage.BAD_REQUEST)

