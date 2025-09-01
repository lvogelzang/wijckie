from django.conf import settings
from django.core.files.storage import default_storage
from drf_spectacular.utils import extend_schema_field
from drf_spectacular.types import OpenApiTypes
from rest_framework import mixins, serializers, viewsets

from wijckie_models.models import (
    FileUpload,
    InspirationModule,
    InspirationOption,
    InspirationOptionType,
)


class InspirationModuleSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    createdAt = serializers.CharField(source="created_at", read_only=True)
    name = serializers.CharField()

    def create(self, validated_data):
        return InspirationModule.objects.create(
            **validated_data, user=self.context["request"].user
        )

    class Meta:
        model = InspirationModule
        fields = ["id", "user", "createdAt", "name"]


class CreateInspirationOptionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    module = serializers.PrimaryKeyRelatedField(
        queryset=InspirationModule.objects.all()
    )
    name = serializers.CharField()
    type = serializers.ChoiceField(InspirationOptionType.choices)
    text = serializers.CharField(required=False)
    image = serializers.PrimaryKeyRelatedField(
        queryset=FileUpload.objects.all(), required=False
    )
    imageURL = serializers.SerializerMethodField(
        "get_image_url", read_only=True, required=False
    )

    @extend_schema_field(OpenApiTypes.STR)
    def get_image_url(self, object):
        return (
            default_storage.url(f"{object.image.file_uuid}/{object.image.file_name}")
            if object.image is not None
            else None
        )

    class Meta:
        model = InspirationOption
        fields = ["id", "module", "name", "type", "text", "image", "imageURL"]


class InspirationOptionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    module = serializers.PrimaryKeyRelatedField(read_only=True)
    name = serializers.CharField()
    type = serializers.ChoiceField(InspirationOptionType.choices)
    text = serializers.CharField(required=False)
    image = serializers.PrimaryKeyRelatedField(
        queryset=FileUpload.objects.all(), required=False
    )
    imageURL = serializers.SerializerMethodField(
        "get_image_url", read_only=True, required=False
    )

    @extend_schema_field(OpenApiTypes.STR)
    def get_image_url(self, object):
        return (
            default_storage.url(f"{object.image.file_uuid}/{object.image.file_name}")
            if object.image is not None
            else None
        )

    class Meta:
        model = InspirationOption
        fields = ["id", "module", "name", "type", "text", "image", "imageURL"]


class InspirationModuleViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = InspirationModuleSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return InspirationModule.objects.none()

        queryset = InspirationModule.objects.filter(user=user)

        return queryset


class InspirationOptionViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    filterset_fields = ["module"]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateInspirationOptionSerializer
        else:
            return InspirationOptionSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return InspirationOption.objects.none()

        queryset = InspirationOption.objects.filter(module__user=user)

        module = self.request.query_params.get("module")
        if module is not None:
            queryset = queryset.filter(module_id=module)

        return queryset
