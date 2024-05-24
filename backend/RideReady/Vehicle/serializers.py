from rest_framework import serializers
from .models import Vehicle, VehicleCategory
from Order.models import Booking
from datetime import date


class VehicleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleCategory
        fields = '__all__'
          
class VehicleSerializer(serializers.ModelSerializer):
    check_booked = serializers.SerializerMethodField()
    get_booked_userId = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = '__all__'


    def get_check_booked(self,obj):
        check_booked = False
        try:
            check = Booking.objects.filter(vehicle__id = obj.id,payment_status=True).order_by('-id')
            if  check :
                latest_booking = check[0]
                if latest_booking.end_date >= date.today():
                    check_booked = True
        except:
            pass
            
        return check_booked
    
    def get_get_booked_userId(self,obj):
        check_booked = False
        try:
            check = Booking.objects.filter(vehicle__id = obj.id)
            if check:
                check_booked = check[0].client.id
        except:
            pass
            
        return check_booked
    
          
          
class AllVehicleSerializer(serializers.ModelSerializer):
    category = VehicleCategorySerializer()
    check_booked = serializers.SerializerMethodField()
    get_booked_userId = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = '__all__'


    def get_check_booked(self,obj):
        check_booked = False
        try:
            check = Booking.objects.filter(vehicle__id = obj.id,payment_status=True).order_by('-id')
            if  check :
                latest_booking = check[0]
                if latest_booking.end_date >= date.today():
                    check_booked = True
        except:
            pass
            
        return check_booked
    
    def get_get_booked_userId(self,obj):
        check_booked = False
        try:
            check = Booking.objects.filter(vehicle__id = obj.id)
            if check:
                check_booked = check[0].client.id
        except:
            pass
            
        return check_booked
          
class VehicleDetailSerializer(serializers.ModelSerializer):
    category = VehicleCategorySerializer()
    check_booked = serializers.SerializerMethodField()
    get_booked_userId = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = '__all__'


    def get_check_booked(self,obj):
        check_booked = False
        try:
            check = Booking.objects.filter(vehicle__id = obj.id,payment_status=True).order_by('-id')
            if  check :
                latest_booking = check[0]
                if latest_booking.end_date >= date.today():
                    check_booked = True
        except:
            pass
            
        return check_booked
    
    def get_get_booked_userId(self,obj):
        check_booked = False
        try:
            check = Booking.objects.filter(vehicle__id = obj.id)
            if check:
                check_booked = check[0].client.id
        except:
            pass
            
        return check_booked