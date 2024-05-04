from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *


class CustomUserAdmin(UserAdmin):
    model = User
    
    list_display =('email','username','is_active','is_staff')
    list_display_links =('email',)
    ordering = ('-id',)
    
    filter_horizontal = (
        "groups",
        "user_permissions",
    )
    
    search_fields = ("username", "first_name", "last_name", "email")
    list_filter = ("is_staff", "is_superuser", "is_active", "groups")  
    
    fieldsets = (
        (None, {'fields': ('username', 'password',)}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email','user_type',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions',)}),
        ('Important dates', {'fields': ("last_login", "date_joined")}),
    )
    
admin.site.register(User,CustomUserAdmin)