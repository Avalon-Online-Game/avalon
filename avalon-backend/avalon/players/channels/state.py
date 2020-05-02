import json
from json import JSONEncoder
import random

##### Project-specific settings
MSG_TYPE_QUEST_CHOICE = "quest_choice"
MSG_TYPE_QUEST_VOTE_RESULT = "quest_vote_result"
MSG_TYPE_QUEST_RESULT = "quest_result"
MSG_TYPE_START = "start"
MSG_TYPE_END = "end"
MSG_TYPE_LEAVE = "leave"
MSG_TYPE_DISCONNECT = "disconnect"
MSG_TYPE_UPDATE = "update"

MESSAGE_TYPES_CHOICES = (
    (MSG_TYPE_QUEST_CHOICE, 'QUEST_CHOICE'),
    (MSG_TYPE_QUEST_VOTE_RESULT, 'QUEST_VOTE_RESULT'),
    (MSG_TYPE_QUEST_RESULT, 'QUEST_RESULT'),
    (MSG_TYPE_START, 'START'),
    (MSG_TYPE_END, 'END'),
    (MSG_TYPE_LEAVE, 'LEAVE'),
    (MSG_TYPE_DISCONNECT, 'DISCONNECT'),
    (MSG_TYPE_UPDATE, 'UPDATE'),
)

MESSAGE_TYPES_LIST = [
    MSG_TYPE_QUEST_CHOICE,
    MSG_TYPE_QUEST_VOTE_RESULT,
    MSG_TYPE_QUEST_RESULT,
    MSG_TYPE_START,
    MSG_TYPE_END,
    MSG_TYPE_LEAVE,
    MSG_TYPE_DISCONNECT,
    MSG_TYPE_UPDATE,
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

    def __init__(self, game, players):
        """
        game: game code
        players: list of dict of player token, username, avatar
        players_roles: list of  tuple of dict of player token, username, avatar and player role
        commander: a tuple of commander token, username, avatar
        commander_index: keeps the commander index
        number_of_players
        quests: list of Quests
        quest_counter
        """
        self.game = game
        self.players = [{'token':p.token, 'username':p.user.username, 'avatar':p.user.avatar, 'num': p.player_num} for p in players]
        self.players_roles = [({'token':p.token, 'username':p.user.username, 'avatar':p.user.avatar}, p.role) for p in players]
        self.number_of_players = len(self.players)
        self.commander_index = random.randint(0, self.number_of_players - 1)
        self.commander = self.players[self.commander_index % self.number_of_players]
        self.quests = []
        self.quest_number = 1

    def get_next_commander(self):
        """
        Sets the new commander
        """
        self.commander_index = (self.commander_index + 1) % self.number_of_players
        self.commander = self.players[self.commander_index]

    def get_next_quest(self):
        pass

    def get_game_result(self):
        pass

    def get_player_data(self, player_token):
        """
        player : token
        Returns player info and night info
        """
        player_role = next(role for player, role in self.players_roles if player['token'] == player_token)
        if player_role.name in self.ROLES_DATA.keys():
            role_data = [player for player, role in self.players_roles if role.name in self.ROLES_DATA[player_role.name]]
            player_data = {'role': player_role.name, 'role_data': role_data}
            return player_data
        return {'role': player_role.name}
    
    def to_json(self):
        json = {
            "game": self.game,
            "players": self.players,
            "commander": self.commander,
            "quests": self.quests,
            "number_of_players": self.number_of_players,
        }
        return json

