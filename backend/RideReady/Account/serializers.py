from rest_framework import serializers
from .models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
import random
import string




class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    passwordConfirm = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ( 'password', 'passwordConfirm','email','user_type')
        extra_kwargs = {
            # 'passwordConfirm': {'required': False},
          #   'last_name': {'required': False}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['passwordConfirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs
   
    def _generate_random_word(self, length=4):
        return ''.join(random.choices(string.ascii_lowercase, k=length))

    def create(self, validated_data):
        email = validated_data['email']
        user_type = validated_data['user_type']
        random_word = self._generate_random_word()
        username = email.split('@')[0] + '_' + email.split('@')[1].split('.')[0] + '_' + random_word
        user = User.objects.create(
            username=username,
            email=validated_data['email'],
            user_type=user_type,
        )

        
        user.set_password(validated_data['password'])
        user.save()

        return user
    
    
class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['email','username','user_type']