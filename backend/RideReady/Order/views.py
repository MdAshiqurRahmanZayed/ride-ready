from django.shortcuts import render
from rest_framework import viewsets ,permissions,generics
from .models import *
from .serializers import *

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
         user = self.request.user 
         queryset = Booking.objects.filter(client__id = user.id)
         return queryset
        

class BookingListAPIView(generics.ListAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingModelSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
         user = self.request.user 
         queryset = Booking.objects.filter(client__id = user.id)
         return queryset
        


class SeeBookingListAPIView(generics.ListAPIView):
    queryset = Booking.objects.all()
    serializer_class = SeeBookingModelSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
         user = self.request.user 
         queryset = Booking.objects.filter(vehicle__owner__id = user.id)
         return queryset
        



