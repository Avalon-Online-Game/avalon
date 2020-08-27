from django.contrib.auth.forms import PasswordResetForm
from django.conf import settings
from allauth.account.adapter import get_adapter
from rest_framework import serializers
from allauth.utils import email_address_exists
from allauth.account import app_settings as allauth_settings
from allauth.account.utils import setup_user_email

from .models import User


class AccountRegistrationSerializer(serializers.Serializer):
    """
    Account registration serializer.
    """
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_username(self, username):
        username = get_adapter().clean_username(username)
        return username

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    'A user is already registered with this e-mail address.')
        return email

    def validate_password(self, password):
        return get_adapter().clean_password(password)

    def custom_signup(self, request, user):
        pass

    def get_cleaned_data(self):
        return {
            'username': self.validated_data.get('username', ''),
            'password': self.validated_data.get('password', ''),
            'email': self.validated_data.get('email', '')
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        self.custom_signup(request, user)
        setup_user_email(request, user, [])
        return user


class AccountDetailsSerializer(serializers.ModelSerializer):
    """
    Custom account detail serializer.
    """
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'avatar', )
        read_only_fields = ('id',)


class PasswordResetSerializer(serializers.Serializer):
    """
    Password reset serializer.
    """
    email = serializers.EmailField()
    password_reset_form_class = PasswordResetForm

    def validate_email(self, value):
        """
        Email validator.
        """
        self.reset_form = self.password_reset_form_class(data=self.initial_data)
        if not self.reset_form.is_valid():
            raise serializers.ValidationError('Error')
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Invalid e-mail address')
        return value

    def save(self):
        """
        Save.
        """
        request = self.context.get('request')
        opts = {
            'use_https': request.is_secure(),
            'from_email': getattr(settings, 'DEFAULT_FROM_EMAIL'),
            'email_template_name': 'password_reset.txt',
            'request': request,
        }
        self.reset_form.save(**opts)
