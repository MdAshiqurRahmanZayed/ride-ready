from django.db import models
from Account.models import User


class VehicleCategory(models.Model):
     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vehicle_category' ,
                              limit_choices_to={'user_type': 'car_owner'})
     name = models.CharField(verbose_name='Category Name', max_length=100,null=False,blank=False,unique=True)
     
     created_at = models.DateTimeField(auto_now_add=True)
     modified_at = models.DateTimeField(auto_now=True)

     def __str__(self):
        return self.name
   
class Vehicle(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_vehicles' ,
                              limit_choices_to={'user_type': 'car_owner'})
    category = models.ForeignKey(VehicleCategory, on_delete=models.CASCADE)
    make = models.CharField(verbose_name='Vehicle Make',null=False,blank=False, max_length=100)
    model = models.CharField(verbose_name='Vehicle Model', max_length=100,null=False,blank=False)
    year = models.CharField( max_length=50)
    price_per_day = models.DecimalField(verbose_name='Price per Day', max_digits=1000, decimal_places=2,)
    image = models.ImageField( upload_to='images/vehicle/',default='default/vehicle.jpg',null=True,blank=True)
    description = models.TextField(default='car description')
    
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.make} {self.model} ({self.year})'
    
    
    