from generate.definition.editing_mode import EditingMode
from generate.definition.fields.base import BaseModelField
from generate.definition.model_field_type import ModelFieldType


class Integer(BaseModelField):
    type = ModelFieldType.INTEGER

    def __init__(self, name, editing_mode, optional, min_value, max_value, in_table):
        self.name = name
        self.editing_mode = editing_mode
        self.optional = optional
        self.min_value = min_value
        self.max_value = max_value
        self.in_table = in_table

    # Generate definitions

    def generate(name, suggestions):
        editing_mode = input('   Enter editing mode ("read write"): ')
        editing_mode = (
            EditingMode(editing_mode)
            if len(editing_mode) > 0
            else EditingMode.READ_WRITE
        )

        suggested_optional = suggestions.get("optional", "false")
        optional = input('   Enter optional ("{suggested_optional}"): ')
        optional = (
            optional == "true" if len(optional) > 0 else suggested_optional == "true"
        )

        min_value = input('   Enter min value (""): ')
        min_value = int(min_value) if len(min_value) > 0 else None

        max_value = input('   Enter max value (""): ')
        max_value = int(max_value) if len(max_value) > 0 else None

        in_table = input('   Enter show in front-end tables ("true"): ')
        in_table = in_table == "true" if len(in_table) > 0 else True

        return Integer(name, editing_mode, optional, min_value, max_value, in_table)

    # Serialize

    def from_dict(dict):
        return Integer(
            dict.get("name"),
            EditingMode(dict.get("editingMode")),
            dict.get("optional"),
            dict.get("minValue", None),
            dict.get("maxValue", None),
            dict.get("inTable"),
        )

    def to_dict(self):
        dict = {
            "name": self.name,
            "type": self.type.value,
            "editingMode": self.editing_mode.value,
            "optional": self.optional,
            "inTable": self.in_table,
        }
        if self.min_value is not None:
            dict["minValue"] = self.min_value
        if self.max_value is not None:
            dict["maxValue"] = self.max_value
        return dict

    # Django model

    django_model_class = "django.db.models.IntegerField"

    def get_imports(self):
        return super().get_imports()

    def get_args(self):
        return super().get_args()

    def get_validators(self):
        validators = []
        if self.min_value is not None:
            validators.append(
                f"django.core.validators.MinValueValidator({self.min_value})"
            )
        if self.max_value is not None:
            validators.append(
                f"django.core.validators.MaxValueValidator({self.max_value})"
            )
        return validators

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
