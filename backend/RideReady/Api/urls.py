from django.urls import path
from Account.views import *
from Vehicle.views import *
from Order.views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,TokenVerifyView
)
from rest_framework import routers

router = routers.SimpleRouter()
router.register(r'category',VehicleCategoryViewSet)
router.register(r'vehicle',VehicleViewSet)
router.register(r'booking',BookingViewSet)


urlpatterns = [
    
    # Authentication
    path('register/',register_view,name='register'),
    path("token/", MyTokenObtainPairView.as_view(),name='MyTokenObtainPairView'),# django simple jwt
    path("token/refresh/", TokenRefreshView.as_view(),name='TokenRefreshView'),    
    
    # Category
     
    path('all-categories/',VehicleCategoryListAPIView.as_view(),name='VehicleCategoryListAPIView'),
    path('all-cars/',VehicleListAPIView.as_view(),name='VehicleListAPIView'),
    path('car/<id>',VehicleRetrieveAPIView.as_view(),name='VehicleRetrieveAPIView'),
     
    path('all-booked/',BookingListAPIView.as_view(),name='BookingListAPIView'),
     
    path('see-all-booked/',SeeBookingListAPIView.as_view(),name='SeeBookingListAPIView'),
    
    
    #Payment
    path('booking/<int:vehicle_id>/payment/', BookingPaymentView.as_view(), name='booking_payment'),
    path('purchase/<payment_data>/<data>/', purchase, name="purchase"),
    
    path('status/', complete, name="complete"),
    
    
    
]+router.urls
