from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
    """
    User manager.
    """
    use_in_migrations = True

    def create_user(self, username, email, password=None,
                    is_staff=False):
        user = self.model(
            username=username,
            email=self.normalize_email(email),
            is_staff=is_staff,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_staffuser(self, username, email, password):
        user = self.create_user(
            username=username,
            email=self.normalize_email(email),
            password=password,
        )
        user.is_staff = True
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password):
        user = self.create_user(
            username=username,
            email=self.normalize_email(email),
            password=password,
        )
        user.is_staff = True
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    """
    User model.
    """
    email = models.EmailField('Email Address', unique=True, max_length = 255)
    username = models.CharField('Username', unique=True, max_length=32)
    is_staff = models.BooleanField('Staff', default=False,
                                   help_text=('Designates whether the user can log into this admin '
                                              'site.'))
    is_admin = models.BooleanField('Admin', default=False)
    is_active = models.BooleanField('Active', default=True,
                                    help_text=('Designates whether this user should be treated as '
                                               'active. Use this instead of deleting accounts.'))
    avatar = models.IntegerField(null=True, default=1)

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email',]

    def __str__(self):
        return self.email

    objects = UserManager()
