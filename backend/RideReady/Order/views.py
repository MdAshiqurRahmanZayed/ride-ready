from django.shortcuts import render,get_object_or_404,redirect
from django.urls import reverse
from rest_framework import viewsets ,permissions,generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.conf import settings
from pysslcmz.payment import SSLCSession
from decimal import Decimal
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
import ast
import json

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
        
 
    
class BookingPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, vehicle_id):
        serializer = BookingSerializerPayment(data=request.data)
        serializer.client = request.user
        vehicle = Vehicle.objects.get(id=vehicle_id)
        cost = 0
        if serializer.is_valid():
            # Extract data from serializer
            start_date = serializer.validated_data['start_date']
            end_date = serializer.validated_data['end_date']

            # Calculate duration
            duration = end_date - start_date

            # Calculate the cost
            cost = duration.days * vehicle.price_per_day

        # Initialize payment session
        store_id = settings.SSL_STORE_ID
        store_pass = settings.SSL_API_KEY
        sslc_session = SSLCSession(sslc_is_sandbox=True, sslc_store_id=store_id, sslc_store_pass=store_pass)
        
        # Build the status URL with the vehicle_id as a query parameter
        status_url = request.build_absolute_uri(reverse("complete"))
        status_url_with_vehicle = f"{status_url}?vehicle_id={vehicle_id}&cost={cost}"

        sslc_session.set_additional_values(
            value_a=str(start_date),
            value_b=str(end_date),
            value_c=request.data['phone'],
            value_d= request.user.id,
        )
        
        sslc_session.set_urls(
            success_url=status_url_with_vehicle,
            fail_url=status_url_with_vehicle, 
            cancel_url=status_url_with_vehicle, 
            ipn_url=status_url_with_vehicle
        )
        
        sslc_session.set_product_integration(
            total_amount=cost,
            currency='BDT',
            product_category=vehicle.category.name,
            product_name=vehicle.make,
            num_of_item=1,
            shipping_method='NO',
            product_profile='non-physical-goods'
        )
        sslc_session.set_customer_info(
            name=request.user.username,
            email=request.user.email,
            address1='',
            address2='',
            city='',
            postcode='',
            country='Bangladesh',
            phone=request.data['phone']
        )

        # Initiate the payment and get the redirect URL
        response_data = sslc_session.init_payment()
        print(response_data)

        
        return Response(response_data)


@csrf_exempt
def complete(request):
    if request.method == 'POST':
        payment_data = request.POST
        vehicle_id = request.GET.get('vehicle_id') 
        cost = request.GET.get('cost') 
        status = payment_data.get('status')
        start_date = payment_data.get('value_a')  
        end_date = payment_data.get('value_b')  
        phone = payment_data.get('value_c')  
        userId = payment_data.get('value_d')  
        # user = payment_data.get('value_e')       
        val_id = payment_data.get('val_id')
        tran_id = payment_data.get('tran_id')
        data = {
            "start_date":start_date,
            "end_date":end_date,
            "phone":phone,
            "userId":userId,
            "vehicle_id":vehicle_id,
            "cost":cost,
            "val_id":val_id,
            "tran_id":tran_id,
        }
        
        # print("Payment Data: vehicle_id =", vehicle_id, "start_date =", start_date, "end_date =", end_date, "phone =", phone)
                
        
        if status == 'VALID':
            val_id = payment_data.get('val_id')
            tran_id = payment_data.get('tran_id')
            return redirect("purchase",  payment_data,data)
        
        elif status == 'FAILED':
            context ={
                "message":"Your Payment Failed! Please Try Again!"
            }
            return Response(context, status=400)
            
        else:
            context = {
                "message":"Your Payment Canceled! Please Try Again!",
            }
            return Response(context, status=400)

# @login_required
def purchase(request, payment_data,data):
    data =   ast.literal_eval(data)

    start_date=data['start_date']
    end_date=data['end_date']
    phone=data['phone']
    userId=data['userId']
    vehicle_id=data['vehicle_id']
    cost=data['cost']
    val_id=data['val_id']
    tran_id=data['tran_id']

    
    booking = Booking.objects.create(
        client_id=userId,
        vehicle_id=vehicle_id,
        start_date=start_date,
        end_date=end_date,
        phone=phone,
        paymentId=tran_id,
        orderId=val_id,
        full_payment_data=str(payment_data),
        payment_status=True,
        cost=cost
    )
    # print(booking)
    

    return redirect(settings.FRONTEND_URL)




