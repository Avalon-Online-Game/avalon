from channels.db import database_sync_to_async
import random
# from avalon.utils import cache
from django.core.cache import cache
from games.models import Game
from players.models import Player

from .exceptions import ClientError
from . import state

@database_sync_to_async
def set_channel_name(player_token, channel_name):
    """
    Set channel name for a player
    """
    player = Player.objects.get(token=player_token)
    player.channel_name = channel_name
    player.save()

@database_sync_to_async
def remove_channel_name(player_token):
    """
    Set channel name for a player
    """
    player = Player.objects.get(token=player_token)
    player.channel_name = ''
    player.save()


@database_sync_to_async
def get_game(player):
    """
    Try to fetch a game for the player.
    """
    try:
        game = Game.objects.prefetch_related('roles').get(code=player.game)
        return game
    except Game.DoesNotExist:
        raise ClientError("GAME_INVALID")

@database_sync_to_async
def get_players(game_code):
    """
    Return players and roles in the game.
    """
    try:
        players = Player.objects.select_related('user').select_related('role').filter(game=game_code)
    except Game.DoesNotExist:
        raise ClientError("GAME_INVALID")
    
    return sorted(players, key=lambda p : p.player_num)

@database_sync_to_async
def start_game(player, game):
    """
    Check if all players have joined then assign a role to each.
    game: game object
    """

    game_players = list(game.players.all())
    if len(game_players) == game.number_of_players:
        if all(player.channel_name for player in game_players):
            return True

    return False


@database_sync_to_async
def set_players_roles(players_roles):
    """
    Set players roles in database
    """
    for player_role in players_roles:
        player = player_role[0]
        role = player_role[1]
        player.role = role
        player.save()
