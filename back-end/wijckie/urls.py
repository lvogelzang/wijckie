from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView
from rest_framework import routers, serializers, viewsets
from wijckie.csrf import csrf
from wijckie_models.models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "is_staff"]


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()


router = routers.DefaultRouter()
router.register(r"users", UserViewSet)

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
)
