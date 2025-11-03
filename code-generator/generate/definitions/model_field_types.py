from generate.definitions.fields.char import Char
from generate.definitions.fields.createdAt import CreatedAt
from generate.definitions.fields.dateTime import DateTime
from generate.definitions.fields.fixedEnumValue import FixedEnumValue
from generate.definitions.fields.foreignKey import ForeignKey
from generate.definitions.fields.integer import Integer
from generate.definitions.fields.order import Order
from generate.definitions.fields.text import Text


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
