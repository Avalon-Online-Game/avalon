from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status
from uuid import uuid4

from users.models import User
from .models import Game
from .serializers import GameCreateSerializer, GameSerializer


class GameListCreateAPIView(generics.ListCreateAPIView):
    """
    post: create new game and generate game code.
    get : list all game instances
    """
    permission_classes = (IsAuthenticated,)
    queryset = Game.objects.all()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return GameCreateSerializer
        return GameSerializer

    def create(self, request, *args, **kwargs):
        game_code = uuid4().hex[:4].upper()
        user = User.objects.get(email=self.request.user)
        data = request.data.copy()
        data.update({'creator': user.id, 'code': game_code})
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class GameRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    get : retrieve a single game with token
    delete : destroy a single game with token
    """
    permission_classes = (IsAuthenticated,)
    queryset = Game.objects.all()
    serializer_class = GameSerializer
