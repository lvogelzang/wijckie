from generate.definitions.editing_mode import EditingMode
from generate.definitions.fields.base import BaseModelField
from generate.definitions.model_field_type import ModelFieldType


class Order(BaseModelField):
    type = ModelFieldType.ORDER

    def __init__(self, name):
        self.name = name
        self.editing_mode = EditingMode.READ_WRITE

    # Generate definitions

    def generate(name, _):
        return Order(name)

    # Serialize

    def from_dict(dict):
        return Order(dict.get("name"))

    def to_dict(self):
        return {"name": self.name, "type": self.type.value}

    # Django model

    django_model_class = "django.db.models.IntegerField"

    def get_imports(self):
        return super().get_imports()

    def get_args(self):
        return ["default=0"]

    def get_validators(self):
        return []

    def to_python_model_field(self):
        return super().to_python_model_field()

    # Django serializer

    django_serializer_class = "rest_framework.serializers.IntegerField"

    def get_django_serializer_args(self, _):
        return []

    def to_django_serializer_field(self, for_create):
        return super().to_django_serializer_field(for_create)

    def get_django_serializer_imports(self):
        return super().get_django_serializer_imports()
