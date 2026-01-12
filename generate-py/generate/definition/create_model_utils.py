from generate.definition.editing_mode import EditingMode
from generate.definition.fields.char import Char
from generate.definition.fields.createdAt import CreatedAt
from generate.definition.fields.fixedEnumValue import FixedEnumValue
from generate.definition.fields.foreignKey import ForeignKey, OnDelete
from generate.definition.fields.order import Order
from generate.definition.inputs.translationsInput import model_translations_input
from generate.definition.model_class import ModelClass
from generate.definition.model_definitions import ModelDefinitions
from generate.definition.model_field_type import ModelFieldType
from generate.definition.model_field_types import (
    ALL_MODEL_FIELD_TYPE_VALUES,
    resolve_model_field_class,
)
from generate.definition.translation_utils import get_predefined_field_translations
from generate.utils.naming import to_camel, to_pascal, to_snake, to_upper_snake


def create_models(module_name):
    module = _create_module(module_name)
    widgets = _create_widgets(module_name, module)
    extra_classes = _create_extra_classes(module_name, module, widgets)

    return ModelDefinitions(module, widgets, extra_classes)


def _create_module(module_name):
    name, short_name, plural_name, short_plural_name, translations = _model_names(
        module_name, "module"
    )
    return _create_model(
        module_name,
        name,
        short_name,
        plural_name,
        short_plural_name,
        translations,
        [
            ForeignKey(
                name="user",
                translations=get_predefined_field_translations("user"),
                editing_mode=EditingMode.READ_ONLY,
                optional=False,
                to="wijckie_models.user.User",
                on_delete=OnDelete.CASCADE,
                is_parent=False,
                in_table=False,
            ),
            CreatedAt(
                "created at",
                get_predefined_field_translations("created at"),
                in_table=False,
            ),
            FixedEnumValue(
                "type",
                f"wijckie_models.module.ModuleType.{to_upper_snake(module_name)}",
            ),
            Char(
                name="name",
                translations=get_predefined_field_translations("name"),
                editing_mode=EditingMode.READ_WRITE,
                optional=False,
                min_length=1,
                max_length=30,
                in_table=True,
                is_object_link_in_table=True,
            ),
            Order(name="order"),
        ],
    )


def _create_widgets(module_name, module_model):
    name, short_name, plural_name, short_plural_name, translations = _model_names(
        module_name, "widget"
    )
    return [
        _create_model(
            module_name,
            name,
            short_name,
            plural_name,
            short_plural_name,
            translations,
            [
                ForeignKey(
                    name="module",
                    translations=get_predefined_field_translations("module"),
                    editing_mode=EditingMode.READ_WRITE_ONCE,
                    optional=False,
                    to=f"wijckie_models.modules.{to_camel(module_name)}.{to_pascal(module_model.name)}",
                    on_delete=OnDelete.CASCADE,
                    is_parent=True,
                    in_table=False,
                ),
                CreatedAt(
                    "created at",
                    get_predefined_field_translations("created at"),
                    in_table=False,
                ),
                Char(
                    name="name",
                    translations=get_predefined_field_translations("name"),
                    editing_mode=EditingMode.READ_WRITE,
                    optional=False,
                    min_length=1,
                    max_length=30,
                    in_table=True,
                    is_object_link_in_table=True,
                ),
                Order(name="order"),
            ],
        )
    ]


def _create_extra_classes(module_name, module, widgets):
    extra_classes = []
    while True:
        name = input('Enter the name of the an extra class (""): ')
        if len(name) == 0:
            break

        short_name = input(f'Enter the short name ("{name.split(" ")[-1]}"): ')
        short_name = short_name if len(short_name) > 0 else name.split(" ")[-1]

        plural_name = input(f'Enter the plural name ("{name}s"): ')
        plural_name = plural_name if len(plural_name) > 0 else f"{name}s"

        short_plural_name = input(
            f'Enter the short plural name ("{plural_name.split(" ")[-1]}"): '
        )
        short_plural_name = (
            short_plural_name
            if len(short_plural_name) > 0
            else plural_name.split(" ")[-1]
        )

        translations = model_translations_input(name, plural_name)

        extra_classes.append(
            _create_model(
                module_name,
                name,
                short_name,
                plural_name,
                short_plural_name,
                translations,
                [],
                module=module,
                widgets=widgets,
            )
        )
    return extra_classes


def _model_names(module_name, model_type):
    name_suggestion = f"{module_name} {model_type}"
    name = input(
        f"Enter the name of the {model_type} model {f'("{name_suggestion}")' if name_suggestion is not None else ""}: "
    )
    name = name if len(name) > 0 else name_suggestion

    short_name = input(f'Enter the short name ("{name.split(" ")[-1]}"): ')
    short_name = short_name if len(short_name) > 0 else name.split(" ")[-1]

    plural_name = input(f'Enter the plural name ("{name}s"): ')
    plural_name = plural_name if len(plural_name) > 0 else f"{name}s"

    short_plural_name = input(
        f'Enter the short plural name ("{plural_name.split(" ")[-1]}"): '
    )
    short_plural_name = (
        short_plural_name if len(short_plural_name) > 0 else plural_name.split(" ")[-1]
    )

    translations = model_translations_input(name, plural_name)

    return name, short_name, plural_name, short_plural_name, translations


def _create_model(
    module_name,
    name,
    short_name,
    plural_name,
    short_plural_name,
    translations,
    default_fields,
    default_ordering=None,
    default_initial_query_filters=None,
    default_optional_query_filters=None,
    module=None,
    widgets=None,
):
    fields = []
    fields = default_fields
    fields.extend(_create_fields(module_name, module, widgets))

    if default_ordering is None:
        default_ordering = []

        for field in fields:
            if field.type == ModelFieldType.ORDER:
                default_ordering.append(to_snake(field.name))
        default_ordering.append("id")

    if default_initial_query_filters is None:
        default_initial_query_filters = []
        for field in fields:
            if field.name == "user":
                default_initial_query_filters.append("user=user")
            elif field.name == "module":
                default_initial_query_filters.append("module__user=user")
            elif field.name == "widget":
                default_initial_query_filters.append("widget__module__user=user")

    if default_optional_query_filters is None:
        default_optional_query_filters = []
        for field in fields:
            if field.name == "module":
                default_optional_query_filters.append("module_id=module")
            elif field.name == "widget":
                default_optional_query_filters.append("widget_id=widget")

    ordering = _get_ordering(default_ordering)
    initial_query_filters = _get_initial_query_filters(default_initial_query_filters)
    optional_query_filters = _get_optional_query_filters(default_optional_query_filters)
    return ModelClass(
        name,
        short_name,
        plural_name,
        short_plural_name,
        translations,
        fields,
        ordering,
        initial_query_filters,
        optional_query_filters,
    )


def _create_fields(module_name, module, widgets):
    fields = []
    while True:
        field_name = input(' Enter the name of the next field (""): ')
        if len(field_name) == 0:
            break

        if field_name == "module" and module is not None:
            suggestion = {
                "type": "foreign key",
                "translations": get_predefined_field_translations("module"),
                "editing_mode": "read write once",
                "optional": False,
                "to": f"wijckie_models.modules.{to_camel(module_name)}.{to_pascal(module.name)}",
                "on_delete": "django.db.models.CASCADE",
                "is_parent": True,
                "in_table": False,
            }
        elif field_name == "widget" and widgets is not None and len(widgets) > 0:
            widget = widgets[0]
            suggestion = {
                "type": "foreign key",
                "translations": get_predefined_field_translations("widget"),
                "editing_mode": "read write once",
                "optional": False,
                "to": f"wijckie_models.modules.{to_camel(module_name)}.{to_pascal(widget.name)}",
                "on_delete": "django.db.models.CASCADE",
                "is_parent": True,
                "in_table": False,
            }
        elif field_name == "name":
            suggestion = {
                "type": "char",
                "translations": get_predefined_field_translations("name"),
                "editing_mode": "read write",
                "optional": False,
                "in_table": True,
                "is_object_link_in_table": True,
                "min_length": 1,
                "max_length": 30,
            }
        else:
            suggestion = {}

        input_text = f"  Enter the type [{", ".join(list(map(lambda v: f'"{v}"', ALL_MODEL_FIELD_TYPE_VALUES)))}]"
        if suggestion.get("type", None) is not None:
            input_text += f' ("{suggestion.get("type")}")'
        input_text += ": "

        field_type = input(input_text)
        field_type = suggestion.get("type") if len(field_type) == 0 else field_type

        cls = resolve_model_field_class(field_type)
        field = cls.generate(field_name, suggestion)
        fields.append(field)
    return fields


def _get_ordering(default_ordering):
    suggested_input = " ".join(default_ordering)
    ordering = input(f' Enter ordering space-separated ("{suggested_input}"): ')
    ordering = ordering if len(ordering) > 0 else suggested_input
    ordering = ordering.split()

    return ordering


def _get_initial_query_filters(default_initial_query_filters):
    suggested_input = " ".join(default_initial_query_filters)
    filters = input(f' Enter initial filters space-separated ("{suggested_input}"): ')
    filters = filters if len(filters) > 0 else suggested_input
    filters = filters.split()

    return filters


def _get_optional_query_filters(default_optional_query_filters):
    suggested_input = " ".join(default_optional_query_filters)
    filters = input(f' Enter optional filters space-separated ("{suggested_input}"): ')
    filters = filters if len(filters) > 0 else suggested_input
    filters = filters.split()

    return filters
