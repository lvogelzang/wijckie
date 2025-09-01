from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView
from rest_framework import routers, serializers, viewsets

from wijckie.csrf import csrf
from wijckie.fileUpload import FileUploadViewSet, dev_file_upload
from wijckie.modules.inspiration import (
    InspirationModuleViewSet,
    InspirationOptionViewSet,
)
from wijckie_models.models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "is_staff"]


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()


router = routers.DefaultRouter()
router.register(r"file-uploads", FileUploadViewSet, basename="file-uploads")
router.register(r"users", UserViewSet)
router.register(
    r"inspiration-modules", InspirationModuleViewSet, basename="inspiration-modules"
)
router.register(
    r"inspiration-options", InspirationOptionViewSet, basename="inspiration-options"
)

urlpatterns = (
    [
        path("api/v1/csrf/", csrf),
        path("api/v1/", include(router.urls)),
        path(
            "api/v1/schema/",
            SpectacularAPIView.as_view(),
            name="schema",
        ),
        path(
            "api/v1/schema/redoc/",
            SpectacularRedocView.as_view(url_name="schema"),
            name="redoc",
        ),
        path("_allauth/", include("allauth.headless.urls")),
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
    # Makes media files upload endpoint available in debug mode.
    + ([path(settings.MEDIA_UPLOAD_URL, dev_file_upload)] if settings.DEBUG else [])
)
