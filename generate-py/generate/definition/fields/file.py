from generate.definition.editing_mode import EditingMode
from generate.definition.fields.base import BaseModelField
from generate.definition.inputs.booleanInput import boolean_input
from generate.definition.inputs.enumInput import editing_mode_input
from generate.definition.inputs.translationsInput import field_translations_input
from generate.definition.model_field_type import ModelFieldType


class File(BaseModelField):
    type = ModelFieldType.FILE

    def __init__(self, name, translations, editing_mode, in_table):
        self.name = name
        self.translations = translations
        self.editing_mode = editing_mode
        self.in_table = in_table

    # Generate definitions

    def generate(name, suggestions):
        translations = field_translations_input(name, suggestions)
        editing_mode = editing_mode_input(suggestions)
        in_table = boolean_input("in_table", suggestions)

        return File(name, translations, editing_mode, in_table)

    # Serialize

    def from_dict(dict):
        return File(
            dict.get("name"),
            dict.get("translations"),
            EditingMode(dict.get("editingMode")),
            dict.get("inTable"),
        )

    def to_dict(self):
        return {
            "name": self.name,
            "translations": self.translations,
            "type": self.type.value,
            "editingMode": self.editing_mode.value,
            "inTable": self.in_table,
        }

    # Django model

    django_model_class = "django.db.models.ForeignKey"

    def get_imports(self):
        imports = ["wijckie_models.fileUpload.FileUpload"]
        imports.extend(super().get_imports())
        return imports

    def get_args(self):
        return [
            "FileUpload",
            "null=True",
            "on_delete=models.CASCADE",
        ]

    def get_validators(self):
        return []

    def to_python_model_field(self):
        return super().to_python_model_field()

    # Django serializer

    django_serializer_class = "rest_framework.serializers.PrimaryKeyRelatedField"

    def get_django_serializer_args(self, for_create):
        args = []
        if self.editing_mode == EditingMode.READ_WRITE:
            args.append(f"queryset=FileUpload.objects.all()")
        elif self.editing_mode == EditingMode.READ_WRITE_ONCE and for_create:
            args.append(f"queryset=FileUpload.objects.all()")

        return args

    def to_django_serializer_field(self, for_create):
        return super().to_django_serializer_field(for_create)

    def get_django_serializer_imports(self):
        imports = []
        if self.editing_mode != EditingMode.READ_ONLY:
            imports.append(self.foreign_key_to)
        imports.extend(super().get_django_serializer_imports())

        return imports
