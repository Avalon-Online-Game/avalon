from channels.db import database_sync_to_async
import random
from .exceptions import ClientError
from games.models import Game
from .models import Player

@database_sync_to_async
def get_game_or_error(player):
    """
    Try to fetch a game for the player.
    """
    try:
        game = Game.objects.get(code=player.game)
    except Game.DoesNotExist:
        raise ClientError("GAME_INVALID")
    
    return game

@database_sync_to_async
def get_players_or_error(game_code):
    """
    Return players in the game.
    """
    try:
        players = Player.objects.filter(game=game_code)
    except Game.DoesNotExist:
        raise ClientError("GAME_INVALID")
    
    goods = {p.token: p.role.name for p in players if p.role.side == 'good'}
    evils = {p.token: p.role.name for p in players if p.role.side == 'evil'}
    return sorted(players, key=lambda p : p.player_num), goods, evils

@database_sync_to_async
def start_game_or_wait(player, game):
    """
    Check if all players have joined then assign a role to each.
    """
    def shuffle(arg):
        tmp = list(arg)[:]
        random.shuffle(tmp)
        return tmp


    start_game = False
    if game.players_joined == game.number_of_players:
        start_game = True

        roles = shuffle(game.roles.all())
        players = shuffle(Player.objects.filter(game=game))

        for pair in zip(players, roles):
            # print(pair)
            pair[0].role = pair[1]
            pair[0].save()

    return start_game



