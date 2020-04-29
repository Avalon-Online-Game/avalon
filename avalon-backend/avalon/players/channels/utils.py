from channels.db import database_sync_to_async
import random
from avalon.utils import cache
from games.models import Game
from players.models import Player

from .exceptions import ClientError
from . import state

@database_sync_to_async
def set_channel_name(player, channel_name):
    """
    Set channel name for a player
    """
    player = Player.objects.get(token=player)
    player.channel_name = channel_name
    player.save()

@database_sync_to_async
def remove_channel_name(player):
    """
    Set channel name for a player
    """
    player = Player.objects.get(token=player)
    player.channel_name = ''
    player.save()


@database_sync_to_async
def get_game(player):
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
        players = Player.objects.select_related('role').select_related('user').filter(game=game_code)
    except Game.DoesNotExist:
        raise ClientError("GAME_INVALID")
    
    players_roles = {(p.token, p.user.username, p.user.avatar): p.role for p in players}
    return sorted(players, key=lambda p : p.player_num), players_roles

@database_sync_to_async
def start_game(player, game):
    """
    Check if all players have joined then assign a role to each.
    game: game object
    """
    def shuffle(arg):
        tmp = list(arg)[:]
        random.shuffle(tmp)
        return tmp

    if game.players_joined == game.number_of_players:
        game_players = game.player_related.all()
        if all(player.channel_name for player in game_players):
            if cache.get(game.code) is None:
                roles = shuffle(game.roles.all())
                players = shuffle(game_players)
                for player_role in zip(players, roles):
                    player = player_role[0]
                    role = player_role[1]
                    player.role = role
                    player.save()

            return True

    return False



