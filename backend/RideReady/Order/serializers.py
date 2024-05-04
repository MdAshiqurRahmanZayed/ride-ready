from rest_framework import serializers
from Vehicle.serializers import VehicleSerializer,VehicleCategorySerializer,VehicleDetailSerializer
from .models import Booking
from datetime import datetime
from Account.serializers import UserSerializer

class BookingSerializer(serializers.ModelSerializer):
     
     class Meta:
          model = Booking
          fields = '__all__'

class BookingModelSerializer(serializers.ModelSerializer):
     vehicle = VehicleSerializer()
     total_cost = serializers.SerializerMethodField()
     
     class Meta:
          model = Booking
          fields = '__all__'


     def get_total_cost(self, obj):
        start_date = obj.start_date
        end_date = obj.end_date
        date1 = datetime.strptime(start_date, '%Y-%m-%d')
        date2 = datetime.strptime(end_date, '%Y-%m-%d')
        total_days = date2-date1
        
        price_per_day = obj.vehicle.price_per_day
        total_days = total_days.days
        
        total_cost = total_days * price_per_day
        return total_cost
   
   
   


class SeeBookingModelSerializer(serializers.ModelSerializer):
     vehicle = VehicleSerializer()
     client  = UserSerializer() 
     
     class Meta:
          model = Booking
          fields = '__all__'

