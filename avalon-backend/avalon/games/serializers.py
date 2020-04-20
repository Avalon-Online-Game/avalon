from rest_framework import serializers

from users.serializers import AccountDetailsSerializer
from .models import Game, Role

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'


class GameSerializer(serializers.ModelSerializer):
    roles = RoleSerializer(many=True)

    class Meta:
        model = Game
        fields = '__all__'


class GameCreateSerializer(serializers.ModelSerializer):
    roles = serializers.SlugRelatedField(many=True,
                                         queryset=Role.objects.all(),
                                         slug_field='name',
                                         write_only=True)

    class Meta:
        model = Game
        fields = '__all__'
