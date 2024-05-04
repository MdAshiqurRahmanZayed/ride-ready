from django.shortcuts import render
from .serializers import *
from rest_framework.decorators import api_view 
from rest_framework.response import Response 
from rest_framework import generics
from rest_framework.permissions import *
from rest_framework import status,permissions
from rest_framework_simplejwt.views import TokenObtainPairView  
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.conf import settings


@api_view(['POST'])
def register_view(request):
     if request.method == 'POST':
          serializers = RegisterSerializer(data = request.data)
          data = {}
          
          if serializers.is_valid(raise_exception=True):
               user = serializers.save()
               data['response'] = "Successfully Registered"
               data['username'] = f'{user}'
               data['email'] = serializers.data['email']
               data['user_id'] = user.id
               data['user_type'] = serializers.data['user_type']
          else:
               data = serializers.errors
          return Response(data) 
     
     
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
     # def validate(self,attrs):
    def validate(self, attrs):

     #    username_field = get_user_model().USERNAME_FIELD
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['type'] = 'Bearer'
        data['lifetime'] = str(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].days) + ' days'
        
        # Include additional user data here
        data['user_id'] = self.user.id
        data['user_email'] = self.user.email
        data['user_username'] = self.user.username
        data['user_type'] = self.user.user_type
        
        return data 
        
 

class MyTokenObtainPairView(TokenObtainPairView):
     serializer_class = MyTokenObtainPairSerializer