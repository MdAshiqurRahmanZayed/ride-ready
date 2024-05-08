from django.shortcuts import render
from rest_framework import viewsets ,generics,parsers
from .models import *
from .serializers import *
from rest_framework import permissions



class VehicleCategoryViewSet(viewsets.ModelViewSet):
    queryset = VehicleCategory.objects.all()
    serializer_class = VehicleCategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
         user = self.request.user 
         queryset = VehicleCategory.objects.filter(user__id = user.id)
         return queryset
        

    
    
class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (parsers.FormParser,parsers.MultiPartParser, parsers.JSONParser)
        
    def get_queryset(self):
         user = self.request.user 
         queryset = Vehicle.objects.filter(owner__id = user.id)
         return queryset
        
        




class VehicleCategoryListAPIView(generics.ListAPIView):
    queryset = VehicleCategory.objects.all()
    serializer_class = VehicleCategorySerializer
    
    
class VehicleListAPIView(generics.ListAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = AllVehicleSerializer
    



class VehicleRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleDetailSerializer
    
    lookup_field = 'id'



