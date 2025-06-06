"""
URL configuration for wijckie project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth.models import User
from django.urls import include, path
from rest_framework import routers, serializers, viewsets
from wijckie.auth import csrf, login, logout, me


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "is_staff"]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


router = routers.DefaultRouter()
router.register(r"users", UserViewSet)

urlpatterns = (
    [
        path("", include(router.urls)),
        path("admin/", admin.site.urls),
        path("api-auth/", include("rest_framework.urls")),
        path("auth/csrf/", csrf),
        path("auth/login/", login),
        path("auth/me/", me),
        path("auth/logout/", logout),
    ]
    # Makes static files accessible in debug mode.
    + (
        static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
        if settings.DEBUG
        else []
    )
    # Makes media files accessible in debug mode.
    + (
        static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
        if settings.DEBUG
        else []
    )
)
