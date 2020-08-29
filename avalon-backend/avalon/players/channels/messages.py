class MessageTypes:
    QUEST_CHOICE = 'quest_choice'
    QUEST_VOTE = 'quest_vote'
    QUEST_VOTE_RESULT = 'quest_vote_result'
    QUEST = 'quest'
    QUEST_SCORE = 'quest_score'
    QUEST_RESULT = 'quest_result'
    START = 'start'
    END = 'end'
    LEAVE = 'leave'
    DISCONNECT = 'disconnect'
    UPDATE = 'update'
    UPDATE_STATE = 'update_state'
    ASSASSINATION = 'assassination'
    ASSASSINATION_RESULT = 'assassination_result'


class ErrorMessage:
    PERMISSION_DENIED = 'player permission denied'
    ACTION_PERMISSION_DENIED = 'player is not permitted to involve in action'
    PLAYER_CAN_NOT_PERFORM_ACTION_TWICE = 'player has already done the action'
    ACTION_IS_DONE = 'all players involved in the action has done the action'
    GAME_STATE_IS_WRONG = 'game is not in this state'
    GAME_IS_NOT_IN_PROGRESS = 'game is not in progress'
    BAD_REQUEST = 'BAD_REQUEST'


score_choices = ['success', 'fail']
vote_choices = ['approve', 'reject']
