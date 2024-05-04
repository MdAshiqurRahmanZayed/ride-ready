import random
import string

from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    USER_TYPES = (
        ('car_owner', 'Car Owner'),
        ('client', 'Client'),
    )

    username = models.CharField(verbose_name='Username', max_length=150, unique=True)
    email = models.EmailField(verbose_name='Email address', unique=True, null=False, blank=False)
    user_type = models.CharField(verbose_name='User Type', max_length=20, choices=USER_TYPES, default='client')

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def _generate_random_word(self, length=4):
        return ''.join(random.choices(string.ascii_lowercase, k=length))

    def save(self, *args, **kwargs):
        if not self.username:
            random_word = self._generate_random_word()
            username = self.email.split('@')[0] + '_' + self.email.split('@')[1].split('.')[0] + '_' + random_word
            self.username = username
        super().save(*args, **kwargs)
