from rest_framework import serializers, viewsets
from rest_framework.response import Response

from wijckie.modules.dailyTodos import DailyTodosWidgetSerializer
from wijckie.modules.inspiration import InspirationWidgetSerializer
from wijckie_models.models import DailyTodosWidget, InspirationWidget


class WidgetsBatchSerializer(serializers.Serializer):
    dailyTodos = DailyTodosWidgetSerializer(many=True)
    inspiration = InspirationWidgetSerializer(many=True)


class WidgetsViewSet(viewsets.ViewSet):
    serializer_class = WidgetsBatchSerializer

    def retrieve(self, request):
        batch = {
            "dailyTodos": DailyTodosWidget.objects.filter(module__user=request.user),
            "inspiration": InspirationWidget.objects.filter(module__user=request.user),
        }

        return Response(WidgetsBatchSerializer(batch).data)
