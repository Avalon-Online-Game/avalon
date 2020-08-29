from . import managers
from . import messages


class WSBaseValidator:
    def __init__(self, consumer, payload, game_state, game_code):
        self.consumer = consumer
        self.payload = payload
        self.game_state = game_state
        self.game_code = game_code


class WSQuestChoiceValidator(WSBaseValidator):
    async def validate(self):
        if self.game_state is None:
            await managers.send_error_message(self.consumer, messages.ErrorMessage.GAME_IS_NOT_IN_PROGRESS)
            return False

        if self.game_state.commander['token'] != self.consumer.scope['user'].token:
            await managers.send_error_message(self.consumer, messages.ErrorMessage.ACTION_PERMISSION_DENIED)
            return False

        chosen_players = self.payload.get('players')
        current_quest = self.game_state.quests[self.game_state.current_quest_number - 1]

        if len(chosen_players) != current_quest.players_number:
            await managers.send_error_message(self.consumer, messages.ErrorMessage.BAD_REQUEST)
            return False

        if not all(quest_player in self.game_state.players for quest_player in chosen_players):
            await managers.send_error_message(self.consumer, messages.ErrorMessage.BAD_REQUEST)
            return False
        return True


class WSQuestVoteValidator(WSBaseValidator):
    async def validate(self):
        if self.game_state is None:
            await managers.send_error_message(self.consumer, messages.ErrorMessage.GAME_IS_NOT_IN_PROGRESS)
            return False

        if self.game_state.state != 'voting':
            await managers.send_error_message(self.consumer, messages.ErrorMessage.GAME_STATE_IS_WRONG)
            return False

        vote = self.payload.get('vote')
        if vote is None or vote not in messages.vote_choices:
            await managers.send_error_message(self.consumer, messages.ErrorMessage.BAD_REQUEST)
            return False

        current_quest = self.game_state.quests[self.game_state.current_quest_number - 1]
        player = self.consumer.scope['user']
        if len(current_quest.votes) == self.game_state.number_of_players:
            await managers.send_error_message(self.consumer, messages.ErrorMessage.ACTION_IS_DONE)
            return False

        if next((player_vote for player_vote in current_quest.votes if
                 player_vote[0]['token'] == player.token), None) is not None:
            await managers.send_error_message(self.consumer,
                                              messages.ErrorMessage.PLAYER_CAN_NOT_PERFORM_ACTION_TWICE)
            return False
        return True


class WSQuestValidator(WSBaseValidator):
    async def validate(self):
        if self.game_state is None:
            await managers.send_error_message(self.consumer, messages.ErrorMessage.GAME_IS_NOT_IN_PROGRESS)
            return False

        if self.game_state.state != 'quest':
            await managers.send_error_message(self.consumer, messages.ErrorMessage.GAME_STATE_IS_WRONG)
            return False

        score = self.payload.get('score')
        if score is None or score not in messages.score_choices:
            await managers.send_error_message(self.consumer, messages.ErrorMessage.BAD_REQUEST)
            return False

        current_quest = self.game_state.quests[self.game_state.current_quest_number - 1]
        if sum(current_quest.scores.values()) == current_quest.players_number:
            await managers.send_error_message(self.consumer, messages.ErrorMessage.ACTION_IS_DONE)
            return False

        quest_player = self.consumer.scope['user']
        if quest_player.token not in [player['token'] for player in current_quest.players]:
            await managers.send_error_message(self.consumer, messages.ErrorMessage.ACTION_PERMISSION_DENIED)
            return False

        if quest_player.token in [player['token'] for player in self.game_state.quest_scored_players]:
            await managers.send_error_message(self.consumer,
                                              messages.ErrorMessage.PLAYER_CAN_NOT_PERFORM_ACTION_TWICE)
            return False
        return True


class WSAssassinationValidator(WSBaseValidator):
    async def validate(self):
        if self.game_state is None:
            await managers.send_error_message(self.consumer, messages.ErrorMessage.GAME_IS_NOT_IN_PROGRESS)
            return False

        if self.game_state.state != 'assassination':
            await managers.send_error_message(self.consumer, messages.ErrorMessage.GAME_STATE_IS_WRONG)
            return False

        player = self.consumer.scope['user']
        if player.role.name != 'assassin':
            await managers.send_error_message(self.consumer, messages.ErrorMessage.ACTION_PERMISSION_DENIED)
            return False

        merlin_choice = self.payload.get('merlin_choice')
        if merlin_choice is None:
            await managers.send_error_message(self.consumer, messages.ErrorMessage.BAD_REQUEST)
            return False

        chosen_player_role = next(((player, role) for player, role in self.game_state.players_roles if
                                   player == merlin_choice), None)

        if chosen_player_role is None:
            await managers.send_error_message(self.consumer, messages.ErrorMessage.BAD_REQUEST)
            return False
        return True


msg_type_to_validator = {
    messages.MessageTypes.QUEST_CHOICE: WSQuestChoiceValidator,
    messages.MessageTypes.QUEST_VOTE: WSQuestVoteValidator,
    messages.MessageTypes.QUEST: WSQuestValidator,
    messages.MessageTypes.ASSASSINATION: WSAssassinationValidator
}
