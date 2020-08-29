from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from channels.auth import AuthMiddlewareStack
from django.contrib.auth.models import AnonymousUser

from players.models import Player


@database_sync_to_async
def get_user(token_key):
    try:
        return Player.objects.select_related('user').select_related('role').get(token=token_key)
    except:
        return AnonymousUser()


class TokenAuthMiddleware:

    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        return TokenAuthMiddlewareInstance(scope, self)


class TokenAuthMiddlewareInstance:
    """
    Token authorization middleware for Django Channels 2
    """

    def __init__(self, scope, middleware):
        self.middleware = middleware
        self.scope = scope
        self.inner = self.middleware.inner

    async def __call__(self, receive, send):
        # Used for querystring token url auth
        query_string = parse_qs(self.scope['query_string'])
        if b'token' in query_string:
            token_key = query_string[b'token'][0].decode()
            self.scope['user'] = await get_user(token_key)
        inner = self.inner(self.scope)
        return await inner(receive, send)


TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))
