# import random
# from django.core.cache import cache

# from games.models import Game
# from .channels import db_utils
# from .channels.state import GameState, Quest


# class AssassinationStateUnitTest:
#     """
#     Assasination state test unit
#     """
    
#     def __init__(self, game_code):
#         self.game = game.objects.prefetch_related('roles').prefetch_related('players').select_related('players__user').get(code=game_code)
#         self.players = self.set_players_roles(self.game)
        

#         self.state = 'assassination'
#         # self.players = [{'token':p.token, 'username':p.user.username, 'avatar':p.user.avatar} for p in players]
#         # self.players_roles = [({'token':p.token, 'username':p.user.username, 'avatar':p.user.avatar}, p.role) for p in players]
#         # self.number_of_players = len(self.players)
#         # self.commander_index = random.randint(0, self.number_of_players - 1)
#         # self.commander = self.players[self.commander_index % self.number_of_players]
#         self.quests = self.init_quests()
#         # self.quests = [Quest(ind + 1, self.game, self.QUESTS[self.number_of_players][ind][0],
#         #                self.QUESTS[self.number_of_players][ind][1]) 
#         #                for ind, x in enumerate(self.QUESTS[self.number_of_players])]
#         self.current_quest_number = 4
#         self.failed_votings = 0
#         # self.current_quest_candidates = []
#         # self.winner = None


#         game_state = GameState(game_code, players)
#         cache.set(game_state.game, game_state)

    
#     def set_players_roles(self, game):
#         players = db_utils.get_players(game.code)
#         roles = list(game.roles.all())
#         random.shuffle(roles)
#         random.shuffle(players)
#         db_utils.set_players_roles(zip(players, roles))
#         return players

    
#     def init_quests(self):
#         quests = []
#         for quest_info, ind in enumerate(GameState.QUESTS[self.game.number_of_players]):
#             quest = Quest(ind + 1, self.game.code, quest_info[0], quest_info[1])
#             quest.scores = {'success': 0, 'fail': quest.fails_number}
#             quest.result
#             if ind == 2: break
        
        
        
#         self.quest_number = quest_number
#         self.game = game
#         self.players_number = players_number
#         self.fails_number = fails_number
#         self.commander = None
#         self.players = []
#         self.votes = []
#         self.scores = {'success': 0, 'fail': 0}
#         self.result = None
#         self.done = False