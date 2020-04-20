from allauth.account.adapter import DefaultAccountAdapter

from .models import User

class CustomAccountAdapter(DefaultAccountAdapter):
    """
    Custom account adapter.
    """
    def save_user(self, request, user, form, commit=False):
        user = super().save_user(request, user, form, commit)
        data = form.cleaned_data
        user.set_password(data.get('password'))
        user.save()
        return user
