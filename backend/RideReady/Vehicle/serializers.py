from rest_framework import serializers
from .models import Vehicle, VehicleCategory
from Order.models import Booking

class VehicleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleCategory
        fields = '__all__'
          
class VehicleSerializer(serializers.ModelSerializer):
    check_booked = serializers.SerializerMethodField()
    
    class Meta:
        model = Vehicle
        fields = '__all__'

    def get_check_booked(self,obj):
        check_booked = False
        try:
            check = Booking.objects.filter(vehicle__id = obj.id)
            if check:
                check_booked = True
        except:
            pass
            
        return check_booked
          
          
class AllVehicleSerializer(serializers.ModelSerializer):
    check_booked = serializers.SerializerMethodField()
    category = VehicleCategorySerializer()
    class Meta:
        model = Vehicle
        fields = '__all__'

    def get_check_booked(self,obj):
        check_booked = False
        try:
            check = Booking.objects.filter(vehicle__id = obj.id)
            if check:
                check_booked = True
        except:
            pass
            
        return check_booked
          
class VehicleDetailSerializer(serializers.ModelSerializer):
    category = VehicleCategorySerializer()
    check_booked = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = '__all__'


    def get_check_booked(self,obj):
        check_booked = False
        try:
            check = Booking.objects.filter(vehicle__id = obj.id)
            if check:
                check_booked = True
        except:
            pass
            
        return check_booked
        
