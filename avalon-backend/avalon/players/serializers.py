from rest_framework import serializers

from users.serializers import AccountDetailsSerializer
from games.serializers import GameSerializer
from games.models import Game
from .models import Player

class PlayerGameSerializer(serializers.RelatedField):
    def get_queryset(self):
        return Game.objects.all()

    def to_representation(self, value):
        return {'number_of_players': value.number_of_players,
                'code': value.code}

    def to_internal_value(self, data):
        return self.get_queryset().get(code=data)


class PlayerSerializer(serializers.ModelSerializer):
    game = PlayerGameSerializer()

    class Meta:
        model = Player
        fields = ('user', 'game', 'token', 'player_num', )
