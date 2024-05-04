from django.db import models
from Account.models import User
from Vehicle.models import *
import uuid

class Booking(models.Model):
     client = models.ForeignKey(User, 
                                on_delete=models.CASCADE, 
                                related_name='bookings',
                                limit_choices_to={'user_type': 'client'})
     
     vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
     start_date = models.CharField( max_length=100)
     end_date = models.CharField( max_length=100)
     phone = models.IntegerField()
    
     created_at = models.DateTimeField(auto_now_add=True)
     modified_at = models.DateTimeField(auto_now=True)
     uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

     # class Meta:
     #      unique_together = ('vehicle', 'start_date', 'end_date')

     def __str__(self):
          return f'Booking for {self.vehicle} by {self.client.username}'
