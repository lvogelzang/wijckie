from generate.definition.fields.char import Char
from generate.definition.fields.createdAt import CreatedAt
from generate.definition.fields.dateTime import DateTime
from generate.definition.fields.fixedEnumValue import FixedEnumValue
from generate.definition.fields.foreignKey import ForeignKey
from generate.definition.fields.integer import Integer
from generate.definition.fields.order import Order
from generate.definition.fields.text import Text


class ModelFieldFactory:
    def from_dict(dict):
        cls = resolve_model_field_class(dict["type"])
        return cls.from_dict(dict)


ALL_MODEL_FIELD_TYPES = [
    Char,
    Text,
    ForeignKey,
    CreatedAt,
    DateTime,
    FixedEnumValue,
    Integer,
    Order,
]
ALL_MODEL_FIELD_TYPE_VALUES = list(map(lambda c: c.type.value, ALL_MODEL_FIELD_TYPES))


def resolve_model_field_class(type_value):
    for field_type in ALL_MODEL_FIELD_TYPES:
        if field_type.type.value == type_value:
            return field_type
    raise Exception(f"Unknown field type {type_value}")
