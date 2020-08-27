from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
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
        try:
            game = Game.objects.prefetch_related('players').get(code=request.data['game'])
        except:
            return Response('game not found', status=status.HTTP_404_NOT_FOUND)
        if game.players.count() == game.number_of_players:
            return Response('game full of players', status=status.HTTP_406_NOT_ACCEPTABLE)
        user_token = uuid4().hex
        player_num = game.players.count() + 1
        serializer_data = {'user': self.request.user.id, 'token': user_token,
                           'game': game.code, 'player_num': player_num}
        print(serializer_data)
        serializer = self.get_serializer(data=serializer_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class PlayerRetreiveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    get : retrieve a single player with token
    delete : destroy a single player with token
    """
    permission_classes = (IsAuthenticated,)
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
