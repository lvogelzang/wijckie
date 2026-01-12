from enum import Enum

from generate.definition.editing_mode import EditingMode
from generate.definition.fields.base import BaseModelField
from generate.definition.inputs.booleanInput import boolean_input, optional_input
from generate.definition.inputs.charInput import char_input
from generate.definition.inputs.enumInput import editing_mode_input, enum_input
from generate.definition.inputs.translationsInput import field_translations_input
from generate.definition.model_field_type import ModelFieldType
from generate.utils.naming import strip_path, strip_path_except_last


class OnDelete(Enum):
    CASCADE = "django.db.models.CASCADE"


class ForeignKey(BaseModelField):
    type = ModelFieldType.FOREIGN_KEY

    def __init__(
        self,
        name,
        translations,
        editing_mode,
        optional,
        to,
        on_delete,
        is_parent,
        in_table,
    ):
        self.name = name
        self.translations = translations
        self.editing_mode = editing_mode
        self.optional = optional
        self.foreign_key_to = to  # path relative from wijckie_models (e.g: User or modules.dailyTodos.DailyTodosModule)
        self.on_delete = on_delete
        self.is_parent = is_parent
        self.in_table = in_table

    def refers_to_parent(self):
        return self.is_parent

    # Generate definitions

    def generate(name, suggestions):
        translations = field_translations_input(name, suggestions)
        editing_mode = editing_mode_input(suggestions)
        optional = optional_input(suggestions)
        to = char_input(
            "to", suggestions, "wijckie_models.modules.dailyTodos.DailyTodosModule"
        )
        on_delete = enum_input("on_delete", OnDelete, suggestions)
        is_parent = boolean_input("is_parent", suggestions)
        in_table = boolean_input("in_table", suggestions)

        return ForeignKey(
            name,
            translations,
            editing_mode,
            optional,
            to,
            on_delete,
            is_parent,
            in_table,
        )

    # Serialize

    def from_dict(dict):
        return ForeignKey(
            dict.get("name"),
            dict.get("translations"),
            EditingMode(dict.get("editingMode")),
            dict.get("optional"),
            dict.get("to", None),
            OnDelete(dict.get("onDelete")),
            dict.get("isParent", False),
            dict.get("inTable"),
        )

    def to_dict(self):
        return {
            "name": self.name,
            "translations": self.translations,
            "type": self.type.value,
            "editingMode": self.editing_mode.value,
            "optional": self.optional,
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
        args = [strip_path(self.foreign_key_to)]
        args.extend(super().get_args())
        args.append(f"on_delete={strip_path_except_last(self.on_delete.value)}")
        return args

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
