import json
from json import JSONEncoder
import random

##### Project-specific settings
MSG_TYPE_QUEST_CHOICE = "quest_choice"
MSG_TYPE_QUEST_VOTE = "quest_vote"
MSG_TYPE_QUEST_VOTE_RESULT = "quest_vote_result"
MSG_TYPE_QUEST_RESULT = "quest_result"
MSG_TYPE_START = "start"
MSG_TYPE_END = "end"
MSG_TYPE_LEAVE = "leave"
MSG_TYPE_DISCONNECT = "disconnect"
MSG_TYPE_UPDATE = "update"

MESSAGE_TYPES_CHOICES = (
    (MSG_TYPE_QUEST_CHOICE, 'QUEST_CHOICE'),
    (MSG_TYPE_QUEST_VOTE, 'QUEST_VOTE'),
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
    MSG_TYPE_QUEST_VOTE,
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

    def __init__(self, quest_number, game, players_number, fails_number):
        """
        quest_number : integer indicating which quest of game it is
        game: game code
        commander : commander player token, username, avatar
        team_players : list of dict of players token, username, avatar
        votes : list of player's dict and their votes (approve, reject)
        score: dict of success and fail numbers
        result : success or fail
        """
        self.quest_number = quest_number
        self.game = game
        self.players_number = players_number
        self.fails_number = fails_number
        self.commander = None
        self.players = []
        self.votes = []
        self.scores = {'success': 0, 'fail': 0}
        self.result = None
        self.done = False


    def set_quest_players(self, game_state):
        """
        Set players going to do the quest and quest commander
        """
        self.players = game_state.current_quest_candidates
        self.commander = game_state.commander

    def collect_votes_result(self):
        """
        Return approve or reject of quest votes
        """
        return 'approve' if len([player_vote[1] for player_vote in self.votes if player_vote[1] == 'approve']) > \
             (len(self.votes) / 2) else 'reject'
    
    def vote(self, player, vote):
        """
        Append player vote to votes list
        """
        self.votes.append(({'token': player.token, 'username': player.user.username, 'avatar': player.user.avatar}, vote))

    def is_vote_complete(self, game_state):
        """
        Returns True if voting is complete
        """
        return True if len(self.votes) == game_state.number_of_players else False

    def set_score(self, score):
        """
        Set a quest player score in the quest scores dict
        """
        if score == 'success':
            self.scores['success'] += 1
        else: self.scores['fail'] += 1

    def set_result(self):
        """
        Return final result of quest
        """
        if self.scores['fail'] >= self.fails_number:
            self.result = 'fail'
        else: self.result = 'success'


class GameState():
    """
    game, players, quests, check conditions
    """

    ROLES_DATA = {
        'merlin': ['minion1', 'minion2', 'minion3', 'assassin', 'oberon', 'morgana'],
        'mordred': ['minion1', 'minion2', 'minion3', 'assassin', 'morgana'],
        'minion1': ['minion2', 'minion3', 'assassin', 'morgana', 'mordred'],
        'minion2': ['minion1', 'minion3', 'assassin', 'morgana', 'mordred'],
        'minion3': ['minion1', 'minion2', 'assassin', 'morgana', 'mordred'],
        'assassin': ['minion1', 'minion2', 'minion3', 'mordred', 'morgana'],
        'morgana': ['minion1', 'minion2', 'minion3', 'mordred', 'assassin'],
        'percival': ['merlin', 'morgana']
    }

    QUESTS = {
        5: [(2, 1), (3, 1), (2, 1), (3, 1), (3, 1)],
        6: [(2, 1), (3, 1), (4, 1), (3, 1), (4, 1)],
        7: [(2, 1), (3, 1), (3, 1), (4, 2), (4, 1)],
        8: [(3, 1), (4, 1), (4, 1), (5, 2), (5, 1)],
        9: [(3, 1), (4, 1), (4, 1), (5, 2), (5, 1)],
        10: [(3, 1), (4, 1), (4, 1), (5, 2), (5, 1)],
    }

    STATE = {
        'quest': 'quest',
        'day': 'day',
        'voting': 'voting',
        'assassination': 'assassination',
        'end': 'end',
    }


    def __init__(self, game, players):
        """
        game: game code
        players: list of dict of player token, username, avatar
        players_roles: list of  tuple of dict of player token, username, avatar and player role
        number_of_players
        commander: a dict of commander token, username, avatar
        commander_index: keeps the commander index
        quests: list of Quests
        current_quest_number: current quest number
        failed_votings: number of consecutive failed votings
        current_quest_candidates: list of players dicts chosen by the commander for the current quest
        doing_quest: boolean to consider if game state is stopped for doing the quest
        """
        self.game = game
        self.state = self.STATE['day']
        self.players = [{'token':p.token, 'username':p.user.username, 'avatar':p.user.avatar} for p in players]
        self.players_roles = [({'token':p.token, 'username':p.user.username, 'avatar':p.user.avatar}, p.role) for p in players]
        self.number_of_players = len(self.players)
        self.commander_index = random.randint(0, self.number_of_players - 1)
        self.commander = self.players[self.commander_index % self.number_of_players]
        self.quests = [Quest(ind + 1, self.game, self.QUESTS[self.number_of_players][ind][0],
                       self.QUESTS[self.number_of_players][ind][1]) 
                       for ind, x in enumerate(self.QUESTS[self.number_of_players])]
        self.current_quest_number = 1
        self.failed_votings = 0
        self.current_quest_candidates = []
        self.winner = None


    def set_next_commander(self):
        """
        Set next commander
        """
        self.commander_index = (self.commander_index + 1) % self.number_of_players
        self.commander = self.players[self.commander_index]


    def set_voting_state(self, chosen_players):
        self.current_quest_candidates = chosen_players
        self.state = self.STATE['voting']


    def update_current_quest(self, quest):
        """
        Update quest in list of quests
        """
        self.quests[self.current_quest_number - 1] = quest


    def set_quest_state(self):
        """
        Set state after quest voting approved
        """
        self.failed_votings = 0
        self.state = self.STATE['quest']


    def set_next_quest_state(self):
        """
        Set states for starting next quest process
        """
        if not self.get_game_result():
            self.current_quest_number += 1
            self.set_next_commander()
            self.state = self.STATE['day']


    def set_failed_voting_state(self):
        """
        Set states for failed voting situation
        """
        self.failed_votings += 1
        self.set_next_commander()
        self.state = self.STATE['day']


    def get_player_data(self, player_token):
        """
        Return player role and role data as dict
        """
        player_role = next(role for player, role in self.players_roles if player['token'] == player_token)
        if player_role.name in self.ROLES_DATA.keys():
            role_data = [player for player, role in self.players_roles if role.name in self.ROLES_DATA[player_role.name]]
            player_data = {'role': player_role.name, 'role_data': role_data}
            return player_data
        return {'role': player_role.name}


    def get_game_result(self):
        """
        Consider if game is done
        """
        if sum(quest.result == 'success' for quest in self.quests) == 3:
            self.state = self.STATE['assassination']
            return True
        if sum(quest.result == 'fail' for quest in self.quests) == 3:
            self.state = self.STATE['end']
            self.winner = 'evil'
            return True
        return False

    
    def assassinate(self, player_role):
        self.state = self.STATE['end']
        if player_role[1].name == 'merlin':
            self.winner = 'evil'


    def to_json(self):
        """
        Serialize game state
        """
        def obj_dict(obj):
            return obj.__dict__

        return {
            'code': self.game,
            'players': self.players,
            'commander': self.commander,
            'quests': json.loads(json.dumps([quest for quest in self.quests if quest.result != None], default=obj_dict)),
            'number_of_players': self.number_of_players,
            'quest_number': self.current_quest_number,
            'failed_votings': self.failed_votings,
            'state': self.state,
            'winner': self.winner,
        }
