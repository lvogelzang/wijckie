from generate.definition.editing_mode import EditingMode
from generate.definition.fields.base import BaseModelField
from generate.definition.model_field_type import ModelFieldType
from generate.utils.naming import get_path, strip_path_except_last, to_snake


class FixedEnumValue(BaseModelField):
    type = ModelFieldType.FIXED_ENUM_VALUE

    def __init__(self, name, value):
        self.name = name
        self.value = value
        self.editing_mode = EditingMode.READ_ONLY

    # Generate definitions

    def generate(name, _):
        value = input("   Enter value: ")
        return FixedEnumValue(name, value)

    # Serialize

    def from_dict(dict):
        return FixedEnumValue(dict.get("name"), dict.get("value", None))

    def to_dict(self):
        return {
            "name": self.name,
            "type": self.type.value,
            "value": self.value,
        }

    # Django model

    django_model_class = None

    def get_imports(self):
        imports = [get_path(self.value)]
        imports.extend(super().get_imports())
        return imports

    def to_python_model_field(self):
        field = f"{to_snake(self.name)} = {strip_path_except_last(self.value)}"
        return field

    # Django serializer

    django_serializer_class = "rest_framework.serializers.CharField"

    def get_django_serializer_args(self, _):
        return []

    def to_django_serializer_field(self, for_create):
        return super().to_django_serializer_field(for_create)

    def get_django_serializer_imports(self):
        return super().get_django_serializer_imports()
