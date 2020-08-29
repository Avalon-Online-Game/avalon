from django.contrib import admin
from django.conf.urls import include
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path('api/v1/users/', include('users.urls')),
    path('api/v1/games/', include('games.urls')),
    path('api/v1/players/', include('players.urls')),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += [path('admin/', admin.site.urls)]
else:
    urlpatterns += [path('merliiin/', admin.site.urls)]
