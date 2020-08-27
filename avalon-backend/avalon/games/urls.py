from django.urls import path

from . import views

urlpatterns = [
    path('', views.GameListCreateAPIView.as_view(), name='create-list-game'),
    path('game/<slug:pk>/', views.GameRetrieveUpdateDestroyAPIView.as_view(), name='retrieve-update-destroy-game'),
]
