from drf_spectacular.utils import extend_schema
from rest_framework import mixins, serializers, viewsets

from wijckie_models.modules.inspiration import InspirationModule


class InspirationModuleSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    createdAt = serializers.CharField(source="created_at", read_only=True)
    name = serializers.CharField()

    def create(self, validated_data):
        print(self.context)
        return InspirationModule.objects.create(
            **validated_data, user=self.context["request"].user
        )

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.save()
        return instance

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
        return InspirationModule.objects.filter(user=self.request.user)
