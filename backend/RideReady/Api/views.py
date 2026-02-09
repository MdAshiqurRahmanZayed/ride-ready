from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from datetime import datetime

# Create your views here.


@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(request):
    """
    Health check endpoint to verify API status
    No authentication required
    """
    try:
        # Check database connection
        connection.ensure_connection()
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    health_data = {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "database": db_status,
        "service": "RideReady API",
    }

    return Response(health_data, status=status.HTTP_200_OK)
