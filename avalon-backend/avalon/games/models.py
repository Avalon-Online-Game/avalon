from django.db import models
from django.contrib.postgres.fields import ArrayField, JSONField
from django.core.validators import MinValueValidator, MaxValueValidator

from users.models import User

SIDE_CHOICES = (
    ('Good', 'good', ),
    ('Evil', 'evil'),
)

ROLE_CHOICES = (
    ('Loyal Servant of Arthur', 'loyal1'),
    ('Loyal Servant of Arthur', 'loyal2'),
    ('Loyal Servant of Arthur', 'loyal3'),
    ('Loyal Servant of Arthur', 'loyal4'),
    ('Loyal Servant of Arthur', 'loyal5'),
    ('Percival', 'percival'),
    ('Merlin', 'merlin'),
    ('Minion of Mordred', 'minion1'),
    ('Minion of Mordred', 'minion2'),
    ('Minion of Mordred', 'minion3'),
    ('Mordred', 'mordred'),
    ('Assassin', 'assassin'),
    ('Morgana', 'morgana'),
    ('Oberon', 'oberon')
)

class Role(models.Model):
    """
    Role model.
    """
    side = models.CharField(max_length=32, choices=SIDE_CHOICES)
    name = models.CharField(max_length=64, choices=ROLE_CHOICES)

    def __str__(self):
        return self.name


class Game(models.Model):
    """
    Game model.
    """
    creator = models.OneToOneField(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=4, primary_key=True)
    roles = models.ManyToManyField(Role)
    number_of_players = models.PositiveIntegerField(validators=[MaxValueValidator(10), MinValueValidator(5)])
    players_joined = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.code
