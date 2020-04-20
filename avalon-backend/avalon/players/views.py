from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from uuid import uuid4

from games.models import Game
from .models import Player
from .serializers import PlayerSerializer

class PlayerListCreateAPIView(generics.ListCreateAPIView):
    """
    create: join a player to a game
    list: list of all players playing
    """
    permission_classes = (IsAuthenticated,)
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer    

    def create(self, request, *args, **kwargs):
        game = get_object_or_404(Game, code=request.data['game'])
        if game.players_joined == game.number_of_players:
            return Response(content='game full of players', status=status.HTTP_406_NOT_ACCEPTABLE)
        user_token = uuid4().hex
        player_num = game.players_joined + 1
        serializer_data = {'user': self.request.user.id, 'token': user_token,
                           'game':game.code, 'player_num':player_num}
        serializer = self.get_serializer(data=serializer_data)
        serializer.is_valid(raise_exception=True)
        # instance = serializer.save()
        # serializer = PlayerSerializer(instance)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        # increment number of players
        game.players_joined += 1
        game.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class PlayerRetreiveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    get : retrieve a single player with token
    delete : destroy a single player with token
    """
    permission_classes = (IsAuthenticated,)
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer