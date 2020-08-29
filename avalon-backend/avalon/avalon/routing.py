from channels.routing import ProtocolTypeRouter, URLRouter

from players.channels.token_auth import TokenAuthMiddlewareStack
from players.channels.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    'websocket': TokenAuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns,
        ),
    ),
})
