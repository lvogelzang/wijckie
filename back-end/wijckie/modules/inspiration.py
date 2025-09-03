from django.core.files.storage import default_storage
from drf_spectacular.utils import extend_schema_field
from drf_spectacular.types import OpenApiTypes
from rest_framework import mixins, serializers, viewsets

from wijckie_models.models import (
    FileUpload,
    InspirationModule,
    InspirationOption,
    InspirationOptionType,
    InspirationWidget,
)
from wijckie_models.modules.inspiration import InspirationItem

# --- Module ---


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


# --- Option ---


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


# --- Item ---


class CreateInspirationItemSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        option = (
            InspirationOption.objects.filter(module=validated_data["module"])
            .order_by("?")
            .first()
        )
        return InspirationItem.objects.create(**validated_data, option=option)

    class Meta:
        model = InspirationItem
        fields = ["id", "module", "date", "option"]
        read_only_fields = ["option"]


class InspirationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InspirationItem
        fields = ["id", "module", "date", "option"]
        read_only_fields = ["module", "date", "option"]


class InspirationItemViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    filterset_fields = ["module", "date"]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateInspirationItemSerializer
        else:
            return InspirationItemSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return InspirationItem.objects.none()

        queryset = InspirationItem.objects.filter(module__user=user)

        module = self.request.query_params.get("module")
        if module is not None:
            queryset = queryset.filter(module_id=module)

        date = self.request.query_params.get("date")
        if date is not None:
            queryset = queryset.filter(date=date)

        return queryset


# --- Widget ---


class CreateInspirationWidgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = InspirationWidget
        fields = ["id", "module", "name"]


class InspirationWidgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = InspirationWidget
        fields = ["id", "module", "name"]
        read_only_fields = ["module"]


class InspirationWidgetViewSet(
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
            return CreateInspirationWidgetSerializer
        else:
            return InspirationWidgetSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return InspirationWidget.objects.none()

        queryset = InspirationWidget.objects.filter(module__user=user)

        module = self.request.query_params.get("module")
        if module is not None:
            queryset = queryset.filter(module_id=module)

        return queryset
