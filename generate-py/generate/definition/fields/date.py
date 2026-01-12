from generate.definition.editing_mode import EditingMode
from generate.definition.fields.base import BaseModelField
from generate.definition.inputs.booleanInput import boolean_input, optional_input
from generate.definition.inputs.enumInput import editing_mode_input
from generate.definition.inputs.translationsInput import field_translations_input
from generate.definition.model_field_type import ModelFieldType


class Date(BaseModelField):
    type = ModelFieldType.DATE

    def __init__(self, name, translations, editing_mode, optional, in_table):
        self.name = name
        self.translations = translations
        self.editing_mode = editing_mode
        self.optional = optional
        self.in_table = in_table

    # Generate definitions

    def generate(name, suggestions):
        translations = field_translations_input(name, suggestions)
        editing_mode = editing_mode_input(suggestions)
        optional = optional_input(suggestions)
        in_table = boolean_input("in_table", suggestions)

        return Date(name, translations, editing_mode, optional, in_table)

    # Serialize

    def from_dict(dict):
        return Date(
            dict.get("name"),
            dict.get("translations"),
            EditingMode(dict.get("editingMode")),
            dict.get("optional"),
            dict.get("inTable"),
        )

    def to_dict(self):
        return {
            "name": self.name,
            "translations": self.translations,
            "type": self.type.value,
            "editingMode": self.editing_mode.value,
            "optional": self.optional,
            "inTable": self.in_table,
        }

    # Django model

    django_model_class = "django.db.models.DateField"

    def get_imports(self):
        return super().get_imports()

    def get_args(self):
        return super().get_args()

    def get_validators(self):
        return []

    def to_python_model_field(self):
        return super().to_python_model_field()

    # Django serializer

    django_serializer_class = "rest_framework.serializers.DateField"

    def get_django_serializer_args(self, _):
        return []

    def to_django_serializer_field(self, for_create):
        return super().to_django_serializer_field(for_create)

    def get_django_serializer_imports(self):
        return super().get_django_serializer_imports()
