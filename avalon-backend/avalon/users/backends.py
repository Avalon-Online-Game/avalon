from django.contrib.auth.backends import ModelBackend
from users.models import User


class EmailAuthBackend(ModelBackend):
	"""
	Email Authentication Backend

	Allows a user to sign in using an email/password pair rather than
	a username/password pair.
	"""
 
	def authenticate(self, request, username=None, password=None):
		""" Authenticate a user based on email address as the user name. """
		try:
			user = User.objects.get(email=username)
			if user.check_password(password):
				return user
		except:
			return None
 