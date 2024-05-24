from django.db import models
from Account.models import User
from Vehicle.models import Vehicle
import uuid
from datetime import datetime

class Booking(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings', limit_choices_to={'user_type': 'client'})
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    phone = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    paymentId = models.CharField(max_length=264, blank=True, null=True)
    orderId = models.CharField(max_length=200, blank=True, null=True)
    full_payment_data = models.TextField(blank=True, null=True)
    payment_status = models.BooleanField(default=False)
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f'Booking for {self.vehicle} by {self.client.username}'

    # def calculate_cost(self):
    #     delta = self.end_date - self.start_date
    #     return delta.days * self.vehicle.price_per_day

    # def save(self, *args, **kwargs):
    #     self.cost = self.calculate_cost()
    #     super().save(*args, **kwargs)
