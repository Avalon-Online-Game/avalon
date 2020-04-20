from django.contrib import admin
from django.conf.urls import include
from django.urls import path
from rest_framework.schemas import get_schema_view


urlpatterns = [
    path('openapi', get_schema_view(
         title="Your Project",
         description="API for all things …",
         version="1.0.0"
    ), name='openapi-schema'),
    path('admin/', admin.site.urls),
    path('api/v1/users/', include('users.urls')),
    path('api/v1/games/', include('games.urls')),
    path('api/v1/players/', include('players.urls')),
]
