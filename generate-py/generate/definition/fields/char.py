from generate.definition.editing_mode import EditingMode
from generate.definition.fields.base import BaseModelField
from generate.definition.model_field_type import ModelFieldType


class Char(BaseModelField):
    type = ModelFieldType.CHAR

    def __init__(
        self,
        name,
        editing_mode,
        optional,
        min_length,
        max_length,
        in_table,
        is_object_link_in_table,
    ):
        self.name = name
        self.editing_mode = editing_mode
        self.optional = optional
        self.min_length = min_length
        self.max_length = max_length
        self.in_table = in_table
        self.is_object_link_in_table = is_object_link_in_table

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

        min_length = input('   Enter min length (""): ')
        min_length = int(min_length) if len(min_length) > 0 else None

        max_length = input('   Enter max length (""): ')
        max_length = int(max_length) if len(max_length) > 0 else None

        in_table = input('   Enter show in front-end tables ("true"): ')
        in_table = in_table == "true" if len(in_table) > 0 else True

        suggested_is_object_link_in_table = "true" if name == "name" else "false"
        is_object_link_in_table = input(
            f'   Enter is object link in table ("{suggested_is_object_link_in_table}"): '
        )
        is_object_link_in_table = (
            is_object_link_in_table == "true"
            if len(is_object_link_in_table) > 0
            else suggested_is_object_link_in_table == "true"
        )

        return Char(
            name,
            editing_mode,
            optional,
            min_length,
            max_length,
            in_table,
            is_object_link_in_table,
        )

    # Serialize

    def from_dict(dict):
        return Char(
            dict.get("name"),
            EditingMode(dict.get("editingMode")),
            dict.get("optional"),
            dict.get("minLength", None),
            dict.get("maxLength", None),
            dict.get("inTable"),
            dict.get("isObjectLinkInTable"),
        )

    def to_dict(self):
        dict = {
            "name": self.name,
            "type": self.type.value,
            "editingMode": self.editing_mode.value,
            "optional": self.optional,
            "inTable": self.in_table,
            "isObjectLinkInTable": self.is_object_link_in_table,
        }
        if self.min_length is not None:
            dict["minLength"] = self.min_length
        if self.max_length is not None:
            dict["maxLength"] = self.max_length
        return dict

    # Django model

    django_model_class = "django.db.models.CharField"

    def django_max_length(self):
        return self.max_length

    def get_imports(self):
        return super().get_imports()

    def get_args(self):
        args = super().get_args()
        if self.max_length is not None:
            args.append(f"max_length = {self.max_length}")
        return args

    def get_validators(self):
        validators = []
        if self.min_length is not None:
            validators.append(
                f"django.core.validators.MinLengthValidator({self.min_length})"
            )
        return validators

    def to_python_model_field(self):
        return super().to_python_model_field()

    # Django serializer

    django_serializer_class = "rest_framework.serializers.CharField"

    def get_django_serializer_args(self, _):
        return []

    def to_django_serializer_field(self, for_create):
        return super().to_django_serializer_field(for_create)

    def get_django_serializer_imports(self):
        return super().get_django_serializer_imports()
