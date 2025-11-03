from generate.definitions.editing_mode import EditingMode
from generate.definitions.fields.base import BaseModelField
from generate.definitions.model_field_type import ModelFieldType
from generate.react.tableUtils import to_table_lines
from generate.utils.naming import to_camel, to_pascal, to_snake


class DateTime(BaseModelField):
    type = ModelFieldType.DATE_TIME

    def __init__(self, name, editing_mode, in_table):
        self.name = name
        self.editing_mode = editing_mode
        self.in_table = in_table

    # Generate definitions

    def generate(name, _):
        editing_mode = input('   editing mode ("read write"): ')
        editing_mode = (
            EditingMode(editing_mode)
            if len(editing_mode) > 0
            else EditingMode.READ_WRITE
        )

        in_table = input('   show in front-end tables ("true"): ')
        in_table = in_table == "true" if len(in_table) > 0 else True

        return DateTime(name, editing_mode, in_table)

    # Serialize

    def from_dict(dict):
        return DateTime(
            dict.get("name"),
            EditingMode(dict.get("editingMode")),
            dict.get("inTable"),
        )

    def to_dict(self):
        return {
            "name": self.name,
            "type": self.type.value,
            "editingMode": self.editing_mode.value,
            "inTable": self.in_table,
        }

    # Django model

    django_model_class = "django.db.models.DateTimeField"

    def get_imports(self):
        return super().get_imports()

    def get_args(self):
        return []

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

    # React

    def show_in_table(self):
        return self.in_table

    def to_table_lines(self, model_name):
        return to_table_lines(model_name, self.name, False)
