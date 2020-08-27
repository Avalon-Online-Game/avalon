from channels.routing import ProtocolTypeRouter, URLRouter

from players.channels.token_auth import TokenAuthMiddleware
from players.channels.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    "websocket": TokenAuthMiddleware(
        URLRouter(
            websocket_urlpatterns,
        ),
    ),
})
