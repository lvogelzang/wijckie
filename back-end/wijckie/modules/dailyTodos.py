from django.conf import settings
from django.core.files.storage import default_storage
from drf_spectacular.utils import extend_schema_field
from drf_spectacular.types import OpenApiTypes
from rest_framework import mixins, serializers, viewsets

from wijckie_models.models import DailyTodosModule, DailyTodoOption, DailyTodosWidget

# --- Module ---


class DailyTodosModuleSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    createdAt = serializers.CharField(source="created_at", read_only=True)
    name = serializers.CharField()

    def create(self, validated_data):
        return DailyTodosModule.objects.create(
            **validated_data, user=self.context["request"].user
        )

    class Meta:
        model = DailyTodosModule
        fields = ["id", "user", "createdAt", "name"]


class DailyTodosModuleViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = DailyTodosModuleSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return DailyTodosModule.objects.none()

        queryset = DailyTodosModule.objects.filter(user=user)

        return queryset


# --- Option ---


class CreateDailyTodoOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyTodoOption
        fields = ["id", "module", "name", "text"]


class DailyTodoOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyTodoOption
        fields = ["id", "module", "name", "text"]
        read_only_fields = ["module"]


class DailyTodoOptionViewSet(
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
            return CreateDailyTodoOptionSerializer
        else:
            return DailyTodoOptionSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return DailyTodoOption.objects.none()

        queryset = DailyTodoOption.objects.filter(module__user=user)

        module = self.request.query_params.get("module")
        if module is not None:
            queryset = queryset.filter(module_id=module)

        return queryset


# --- Widget ---


class CreateDailyTodosWidgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyTodosWidget
        fields = ["id", "module", "name"]


class DailyTodosWidgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyTodosWidget
        fields = ["id", "module", "name"]
        read_only_fields = ["module"]


class DailyTodosWidgetViewSet(
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
            return CreateDailyTodosWidgetSerializer
        else:
            return DailyTodosWidgetSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return DailyTodosWidget.objects.none()

        queryset = DailyTodosWidget.objects.filter(module__user=user)

        module = self.request.query_params.get("module")
        if module is not None:
            queryset = queryset.filter(module_id=module)

        return queryset
