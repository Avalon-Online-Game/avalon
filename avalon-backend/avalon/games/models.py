from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from users.models import User


class Role(models.Model):
    """
    Role model.
    """
    SIDE_CHOICES = [
        ('good', 'Good', ),
        ('evil', 'Evil'),
    ]
    ROLE_CHOICES = [
        ('loyal1', 'Loyal1'),
        ('loyal2', 'Loyal2'),
        ('loyal3', 'Loyal3'),
        ('loyal4', 'Loyal4'),
        ('loyal5', 'Loyal5'),
        ('percival', 'Percival'),
        ('merlin', 'Merlin'),
        ('minion1', 'Minion1'),
        ('minion2', 'Minion2'),
        ('minion3', 'Minion13'),
        ('mordred', 'Mordred'),
        ('assassin', 'Assassin'),
        ('morgana', 'Morgana'),
        ('oberon', 'Oberon')
    ]

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

    def __str__(self):
        return self.code
