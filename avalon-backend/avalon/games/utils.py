import json
from json import JSONEncoder

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

    def __init__(self, game, players, goods, evils):
        """
        game: game code
        players(in order)
        goods
        evils
        commander
        commander_counter
        number_of_players
        board_info : dict containing (number_of_players, int), ????
        quests: list of Quest
        quest_counter
        """
        self.game = game
        self.players = [p.token for p in players]
        self.goods = goods
        self.evils = evils
        self.commander = None
        self.commander_counter = 0
        self.number_of_players = len(self.players)
        self.board_info = self.AVALON_MANUAL.get(self.number_of_players, None)
        self.quests = []
        self.quest_counter = 0
        # print("goods", self.goods)
        # print("evils", self.evils)

    
    def get_next_commander(self):
        self.commander = self.players[self.commander_counter%self.number_of_players]
        self.commander_counter+=1
        # print(self.commander)

    def get_next_quest(self):
        pass


    def get_game_result(self):
        pass

    def get_player_response(self, player):
        """
        player : token
        Returns team info for the player.
        """
        try:
            json = { 'role' : self.goods.get(player)}
            json.update(self.goods)
        except:
            json = { 'role' : self.evils.get(player)}
            json.update(self.evils)
        # return None if x is None else something_else
        return json
    
    def to_json(self):
        json = {
            "game": self.game,
            # "goods": self.goods,
            # "evils": self.evils,
            "commander": self.commander,
            # "board_info" : self.board_info,
            # "quests": self.quests,
            }
        return json

