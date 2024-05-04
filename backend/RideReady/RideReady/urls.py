from django.contrib import admin
from django.urls import path,include,re_path
from django.conf import settings
from django.conf.urls.static import static


from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="RideReady API",
        default_version='v1',
        description="RideReady is a car renting API where users can rent different categories of vehicles. There are two types of users: car owners and clients. Car owners can list their vehicles for rent, while clients can browse and book available vehicles.",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)





urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include('Account.urls')),
    path("api/", include('Api.urls')),
    path('api/v1/',
         include([
                path('swagger.json/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
                path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
                path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
         ])
         
         )
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 