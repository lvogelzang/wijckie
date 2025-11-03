from enum import Enum


class EditingMode(Enum):
    READ_ONLY = "read only"
    READ_WRITE = "read write"
    READ_WRITE_ONCE = "read write once"
