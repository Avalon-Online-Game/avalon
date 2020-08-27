from django.conf.urls import include
from django.conf.urls.static import static
from django.conf import settings
from django.urls import path
from rest_auth.registration.views import VerifyEmailView
from rest_auth.views import PasswordResetView
from .views import (
    CustomRegistrationView,
    CustomLoginView,
)


urlpatterns = [
    path('rest-auth/password_reset/', PasswordResetView.as_view()),
    path('rest-auth/login/', CustomLoginView.as_view()),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', CustomRegistrationView.as_view()),
    path('rest-auth/registration/account-confirm-email/<int:key>/', VerifyEmailView.as_view()),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    path('accounts/', include('allauth.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
