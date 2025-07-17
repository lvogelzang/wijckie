from django.views.decorators.csrf import ensure_csrf_cookie
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny


@extend_schema(
    description="Get CSRF token as a cookie.",
    responses={
        200: inline_serializer(
            name="Default OK response",
            fields={"status": serializers.CharField(default="OK")},
        ),
    },
)
@api_view(["GET"])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def csrf(_):
    return Response({"status": "OK"})
