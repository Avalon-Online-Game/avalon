from django.db import models

from games.models import Game, Role
from users.models import User


class Player(models.Model):
    """
    Player model.
    """    
    user = models.OneToOneField(User, on_delete=models.CASCADE,
                                related_name="player",
                                related_query_name="player")
    token = models.CharField(max_length=100, primary_key=True)
    game = models.ForeignKey(Game, on_delete=models.CASCADE,
                             related_name="players",
                             related_query_name="players")

    role = models.ForeignKey(Role, on_delete=models.CASCADE,
                             related_name="player",
                             related_query_name="player", null=True)
    player_num = models.PositiveIntegerField()
    channel_name = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.token
