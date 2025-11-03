import os
from os import listdir
from os.path import isfile, join


def to_snake(s: str) -> str:
    return s.replace(" ", "_").lower()


def to_upper_snake(s: str) -> str:
    return s.replace(" ", "_").upper()


def to_camel(s: str) -> str:
    words = s.split()
    return words[0] + "".join(word.capitalize() for word in words[1 : len(words)])


def from_camel(s: str) -> str:
    return "".join(" " + c.lower() if c.isupper() else c for c in s)


def to_pascal(s: str) -> str:
    return "".join(word.capitalize() for word in s.split())


def to_dashed(s: str) -> str:
    return s.replace(" ", "-")


def get_path(s: str) -> str:
    return s[0 : s.rindex(".")]


def get_path_except_last(s: str) -> str:
    to_strip = 2
    result = s
    while to_strip > 0:
        result = result[0 : result.rindex(".")]
        to_strip -= 1
    return result


def strip_path(s: str) -> str:
    return s[s.rindex(".") + 1 : len(s)]


def strip_parenthesis(s: str) -> str:
    i = s.find("(")
    if i == -1:
        return s
    return s[0:i]


def strip_path_except_last(s: str) -> str:
    count = s.count(".")
    to_strip = count - 1
    result = s
    while to_strip > 0:
        result = result[result.index(".") + 1 : len(result)]
        to_strip -= 1
    return result


def get_all_module_names():
    names = []
    definitions_dir = os.getenv("MODULE_DEFINITIONS_DIRECTORY")
    for file in listdir(definitions_dir):
        if not isfile(join(definitions_dir, file)) or not file.endswith(".json"):
            continue
        name = file[0:-5]
        names.append(name)
    return names
