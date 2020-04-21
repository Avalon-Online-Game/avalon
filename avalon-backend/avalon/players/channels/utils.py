from channels.db import database_sync_to_async
import random
from avalon.utils import cache
from games.models import Game
from players.models import Player

from .exceptions import ClientError
from . import state


@database_sync_to_async
def get_game_or_error(player):
    """
    Try to fetch a game for the player.
    """
    try:
        game = Game.objects.get(code=player.game)
        return game
    except Game.DoesNotExist:
        raise ClientError("GAME_INVALID")

@database_sync_to_async
def get_players_and_roles(game_code):
    """
    Return players and roles in the game.
    """
    try:
        players = Player.objects.filter(game=game_code)
    except Game.DoesNotExist:
        raise ClientError("GAME_INVALID")
    
    players_roles = {p.token: p.role for p in players}
    return sorted(players, key=lambda p : p.player_num), players_roles

@database_sync_to_async
def start_game_state(player, game):
    """
    Check if all players have joined then assign a role to each.
    game: game object
    """
    def shuffle(arg):
        tmp = list(arg)[:]
        random.shuffle(tmp)
        return tmp

    if cache.get(game.code) is not None:
        return True

    if game.players_joined == game.number_of_players:
        roles = shuffle(game.roles.all())
        players = shuffle(Player.objects.filter(game=game))

        for player_role in zip(players, roles):
            # print(pair)
            player = player_role[0]
            role = player_role[1]
            player.role = role
            player.save()
        
        return True

    return False



