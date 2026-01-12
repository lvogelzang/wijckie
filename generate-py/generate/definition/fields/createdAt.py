from generate.definition.editing_mode import EditingMode
from generate.definition.fields.base import BaseModelField
from generate.definition.inputs.booleanInput import boolean_input
from generate.definition.model_field_type import ModelFieldType
from generate.definition.translation_utils import get_predefined_field_translations


class CreatedAt(BaseModelField):
    type = ModelFieldType.CREATED_AT

    def __init__(self, name, translations, in_table):
        self.name = name
        self.translations = translations
        self.editing_mode = EditingMode.READ_ONLY
        self.optional = False
        self.in_table = in_table

    # Generate definitions

    def generate(name, suggestions):
        in_table = boolean_input("in_table", suggestions)

        return CreatedAt(
            name, get_predefined_field_translations("created at"), in_table
        )

    # Serialize

    def from_dict(dict):
        return CreatedAt(
            dict.get("name"),
            dict.get("translations"),
            dict.get("inTable"),
        )

    def to_dict(self):
        return {
            "name": self.name,
            "translations": self.translations,
            "type": self.type.value,
            "inTable": self.in_table,
        }

    # Django model

    django_model_class = "django.db.models.DateTimeField"

    def get_imports(self):
        imports = ["django.utils.timezone"]
        imports.extend(super().get_imports())
        return imports

    def get_args(self):
        args = super().get_args()
        args.append("default=timezone.now")
        return args

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
