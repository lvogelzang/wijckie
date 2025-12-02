from generate.definition.editing_mode import EditingMode
from generate.definition.fields.base import BaseModelField
from generate.definition.model_field_type import ModelFieldType


class CreatedAt(BaseModelField):
    type = ModelFieldType.CREATED_AT

    def __init__(self, name, in_table):
        self.name = name
        self.editing_mode = EditingMode.READ_ONLY
        self.in_table = in_table

    # Generate definitions

    def generate(name, _):
        in_table = input('   Enter show in front-end tables ("false"): ')
        in_table = in_table == "true" if len(in_table) > 0 else False

        return CreatedAt(name, in_table)

    # Serialize

    def from_dict(dict):
        return CreatedAt(
            dict.get("name"),
            dict.get("inTable"),
        )

    def to_dict(self):
        return {"name": self.name, "type": self.type.value, "inTable": self.in_table}

    # Django model

    django_model_class = "django.db.models.DateTimeField"

    def get_imports(self):
        imports = ["django.utils.timezone"]
        imports.extend(super().get_imports())
        return imports

    def get_args(self):
        return ["default=timezone.now"]

    def get_validators(self):
        return []

    def to_python_model_field(self):
        return super().to_python_model_field()

    # Django serializer

    django_serializer_class = "rest_framework.serializers.DateTimeField"

    def get_django_serializer_args(self, _):
        return []

    def to_django_serializer_field(self, for_create):
        return super().to_django_serializer_field(for_create)

    def get_django_serializer_imports(self):
        return super().get_django_serializer_imports()
