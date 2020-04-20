from django.urls import path

from channels.http import AsgiHandler
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

from players.consumers import PlayerConsumer
from players.token_auth import TokenAuthMiddleware

application = ProtocolTypeRouter({
    "websocket": TokenAuthMiddleware(
        URLRouter([
            path("connect", PlayerConsumer),
        ]),
    ),

})