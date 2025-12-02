from generate.definition.editing_mode import EditingMode
from generate.definition.fields.base import BaseModelField


class Id(BaseModelField):
    def __init__(self):
        self.name = "id"
        self.editing_mode = EditingMode.READ_ONLY
        self.optional = False

    # Django serializer

    django_serializer_class = "rest_framework.serializers.IntegerField"
