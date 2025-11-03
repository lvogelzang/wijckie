from enum import Enum

from generate.definitions.editing_mode import EditingMode
from generate.definitions.fields.base import BaseModelField
from generate.definitions.model_field_type import ModelFieldType
from generate.react.tableUtils import to_table_lines
from generate.utils.naming import (
    strip_path,
    strip_path_except_last,
    to_camel,
    to_pascal,
    to_snake,
)


class OnDelete(Enum):
    CASCADE = "django.db.models.CASCADE"


class ForeignKey(BaseModelField):
    type = ModelFieldType.FOREIGN_KEY

    def __init__(self, name, editing_mode, to, on_delete, is_parent, in_table):
        self.name = name
        self.editing_mode = editing_mode
        self.foreign_key_to = to  # path relative from wijckie_models (e.g: User or modules.dailyTodos.DailyTodosModule)
        self.on_delete = on_delete
        self.is_parent = is_parent
        self.in_table = in_table

    def refers_to_parent(self):
        return self.is_parent

    # Generate definitions

    def generate(name, suggestions):
        suggested_editing_mode = suggestions.get("editing_mode", "read write")
        suggested_to = suggestions.get("to", None)

        editing_mode = input(f'   editing mode ("{suggested_editing_mode}"): ')
        editing_mode = (
            EditingMode(editing_mode)
            if len(editing_mode) > 0
            else EditingMode(suggested_editing_mode)
        )

        input_text = (
            '   to (e.g: "wijckie_models.modules.dailyTodos.DailyTodosModule"): '
            if suggested_to is None
            else f'   to ("{suggested_to}"): '
        )
        to = input(input_text)
        to = suggested_to if len(to) == 0 else to

        on_delete = input('   on_delete ("cascade"): ')
        on_delete = OnDelete(on_delete) if len(on_delete) > 0 else OnDelete.CASCADE

        is_parent = input('   is_parent ("true"): ')
        is_parent = is_parent == "true" if len(is_parent) > 0 else True

        suggested_in_table = name not in ["module", "widget"]
        in_table = input(
            f'   show in front-end tables ("{"true" if suggested_in_table else "false"}"): '
        )
        in_table = in_table == "true" if len(in_table) > 0 else suggested_in_table

        return ForeignKey(name, editing_mode, to, on_delete, is_parent, in_table)

    # Serialize

    def from_dict(dict):
        return ForeignKey(
            dict.get("name"),
            EditingMode(dict.get("editingMode")),
            dict.get("to", None),
            OnDelete(dict.get("onDelete")),
            dict.get("isParent", False),
            dict.get("inTable"),
        )

    def to_dict(self):
        return {
            "name": self.name,
            "type": self.type.value,
            "editingMode": self.editing_mode.value,
            "to": self.foreign_key_to,
            "onDelete": self.on_delete.value,
            "isParent": self.is_parent,
            "inTable": self.in_table,
        }

    # Django model

    django_model_class = "django.db.models.ForeignKey"

    def get_imports(self):
        imports = [self.foreign_key_to]
        imports.extend(super().get_imports())
        return imports

    def get_args(self):
        return [
            strip_path(self.foreign_key_to),
            f"on_delete={strip_path_except_last(self.on_delete.value)}",
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
            args.append(f"queryset={strip_path(self.foreign_key_to)}.objects.all()")
        elif self.editing_mode == EditingMode.READ_WRITE_ONCE and for_create:
            args.append(f"queryset={strip_path(self.foreign_key_to)}.objects.all()")

        return args

    def to_django_serializer_field(self, for_create):
        return super().to_django_serializer_field(for_create)

    def get_django_serializer_imports(self):
        imports = []
        if self.editing_mode != EditingMode.READ_ONLY:
            imports.append(self.foreign_key_to)
        imports.extend(super().get_django_serializer_imports())

        return imports

    # React

    def show_in_table(self):
        return self.in_table

    def to_table_lines(self, model_name):
        return to_table_lines(model_name, self.name, False)
