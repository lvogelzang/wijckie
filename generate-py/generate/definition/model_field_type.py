from enum import Enum


class ModelFieldType(Enum):
    CHAR = "char"
    TEXT = "text"
    INTEGER = "integer"
    FOREIGN_KEY = "foreign key"
    DATE_TIME = "date time"
    FIXED_ENUM_VALUE = "fixed enum value"
    CREATED_AT = "created at"
    ORDER = "order"
