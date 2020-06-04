from django.urls import path

from channels.http import AsgiHandler
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

# from players.channels.consumers import PlayerConsumer
from players.channels.token_auth import TokenAuthMiddleware
from players.channels.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    "websocket": TokenAuthMiddleware(
        URLRouter(
            # path("connect", PlayerConsumer),
            websocket_urlpatterns,
        ),
    ),

})