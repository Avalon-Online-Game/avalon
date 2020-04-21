import json
from json import JSONEncoder

##### Project-specific settings
MSG_TYPE_COMMANDER = "commander"
MSG_TYPE_QUEST_CHOICE = "quest_choice"
MSG_TYPE_QUEST_VOTE = "quest_vote"
MSG_TYPE_QUEST_RESULT = "quest_result"
MSG_TYPE_NIGHT = "night"
MSG_TYPE_START = "start"
MSG_TYPE_END = "end"
MSG_TYPE_LEAVE = "leave"

MESSAGE_TYPES_CHOICES = (
    (MSG_TYPE_COMMANDER, 'COMMANDER'),
    (MSG_TYPE_QUEST_CHOICE, 'QUEST_CHOICE'),
    (MSG_TYPE_QUEST_VOTE, 'QUEST_VOTE'),
    (MSG_TYPE_QUEST_RESULT, 'QUEST_RESULT'),
    (MSG_TYPE_NIGHT, 'NIGHT'),
    (MSG_TYPE_START, 'START'),
    (MSG_TYPE_END, 'END'),
    (MSG_TYPE_LEAVE, 'LEAVE'),
)

MESSAGE_TYPES_LIST = [
    MSG_TYPE_COMMANDER,
    MSG_TYPE_QUEST_CHOICE,
    MSG_TYPE_QUEST_VOTE,
    MSG_TYPE_QUEST_RESULT,
    MSG_TYPE_NIGHT,
    MSG_TYPE_START,
    MSG_TYPE_END,
    MSG_TYPE_LEAVE,
]

class Quest():
    """
    number of quest, game, commander, team players, votes, scores, result
    """

    def __init__(self, quest_number, game, commander, team_players=[], votes={}, scores=[], result=None):
        """
        quest_number : integer indicating which quest of game it is
        game: game code
        commander : player token
        team_players : list of player tokens
        votes : dict mapping player's token to (approve, reject)
        score: list of (success, fail)
        result : (success, fail)
        """
        self.quest_number = quest_number
        self.game = game
        self.commander = commander
        self.team_players = team_players
        self.votes = votes
        self.scores = scores
        self.result = result
        self.approved = False


    def set_team_players(self):
        """
        """
        pass

    def collect_votes(self):
        """
        Return approve or reject.
        """
        pass

    def collect_scores(self):
        """
        Return final result of quest.
        """
        pass


class GameState():
    """
    game, players, quests, check conditions
    """

    AVALON_MANUAL = {
        5: {},
        6: {},
        7: {},
        8: {},
        9: {},
        10: {},
    }

    ROLES_DATA = {
        'merlin': ['minion1', 'minion2', 'minion3', 'assassin', 'oberon', 'morgana'],
        'mordred': ['minion1', 'minion2', 'minion3', 'assassin', 'morgana'],
        'oberan': ['minion1', 'minion2', 'minion3', 'assassin', 'morgana', 'mordred'],
        'minion1': ['minion2', 'minion3', 'assassin', 'morgana', 'mordred'],
        'minion2': ['minion1', 'minion3', 'assassin', 'morgana', 'mordred'],
        'minion3': ['minion1', 'minion2', 'assassin', 'morgana', 'mordred'],
        'assassin': ['minion1', 'minion2', 'minion3', 'mordred', 'morgana'],
        'morgana': ['minion1', 'minion2', 'minion3', 'mordred', 'assassin'],
        'percival': ['merlin', 'morgana']
    }

    def __init__(self, game, players, players_roles):
        """
        game: game code
        players(in order)
        commander
        commander_counter
        number_of_players
        board_info : dict containing (number_of_players, int), ????
        quests: list of Quest
        quest_counter
        """
        self.game = game
        self.players = [p.token for p in players]
        self.players_roles = players_roles
        self.commander = None
        self.commander_counter = 0
        self.number_of_players = len(self.players)
        self.board_info = self.AVALON_MANUAL.get(self.number_of_players, None)
        self.quests = []
        self.quest_counter = 0

    
    def get_next_commander(self):
        self.commander = self.players[self.commander_counter%self.number_of_players]
        self.commander_counter+=1

    def get_next_quest(self):
        pass


    def get_game_result(self):
        pass

    def get_player_data(self, player):
        """
        player : token
        Returns team info for the player.
        """
        player_role = self.players_roles.get(player)
        if player_role.name in self.ROLES_DATA.keys():
            role_data = [player for player,role in self.players_roles.items() if role.name in self.ROLES_DATA[player_role.name]]
            player_data = {'role': player_role.name, 'role_data': role_data}
            return json.dumps(player_data)
        return json.dumps({'role': player_role.name})
    
    def to_json(self):
        json = {
            "game": self.game,
            "players": self.players,
            # "goods": self.goods,
            # "evils": self.evils,
            "commander": self.commander,
            "board_info" : self.board_info,
            "quests": self.quests,
        }
        return json

