from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async, async_to_sync
from channels.auth import AuthMiddlewareStack
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from players.models import Player

@database_sync_to_async
def get_user(token_key):
    try:
        return Player.objects.select_related('user').select_related('role').get(token=token_key)
    except:
        return AnonymousUser


class TokenAuthMiddleware:
    """
    Token authorization middleware for Django Channels 2
    see:
    https://channels.readthedocs.io/en/latest/topics/authentication.html#custom-authentication
    """

    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        return TokenAuthMiddlewareInstance(scope, self)


class TokenAuthMiddlewareInstance:
    def __init__(self, scope, middleware):
        self.middleware = middleware
        self.scope = dict(scope)
        self.inner = self.middleware.inner

    async def __call__(self, receive, send):
        #Used for querystring token url auth
        query_string = parse_qs(self.scope['query_string'])
        
        if b'token' in query_string:
            token_key = query_string[b'token'][0].decode()
            self.scope['user'] = await get_user(token_key)

        inner = self.inner(self.scope)
        return await inner(receive, send)
        # return self.inner(self.scope)

TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))