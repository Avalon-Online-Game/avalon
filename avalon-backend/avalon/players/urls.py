from django.urls import path

from . import views

urlpatterns = [
    path('', views.PlayerListCreateAPIView.as_view(), name='create-list-player'),
    path('player/<slug:pk>/', views.PlayerRetreiveUpdateDestroyAPIView.as_view(),
         name='retrieve-update-destroy-player'),
]
