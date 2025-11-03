import ast
import os

from jinja2 import Environment, FileSystemLoader

from generate.utils.naming import to_snake, to_upper_snake


def add_module_type_enum(module_name):
    values = _get_current_values()
    values = set(values)
    values.add(to_upper_snake(module_name))
    values = list(values)
    values.sort()

    _write(values)


def _get_current_values():
    module_type_enum_file = os.getenv("DJANGO_MODULE_TYPE_ENUM_FILE")
    f = open(module_type_enum_file)
    tree = ast.parse(f.read())

    enums = []
    for node in ast.walk(tree):
        if isinstance(node, ast.ClassDef) and node.name == "ModuleType":
            for body_item in node.body:
                if isinstance(body_item, ast.Assign):
                    for target in body_item.targets:
                        if isinstance(target, ast.Name):
                            enums.append(target.id)

    return enums


def _write(values):
    env = Environment(loader=FileSystemLoader("templates"))
    tmpl = env.get_template("module_type_enum.jinja2")

    context = {
        "values": list(
            map(
                lambda v: {"pythonic": to_upper_snake(v), "string": to_snake(v)}, values
            )
        )
    }

    output = tmpl.render(**context)

    module_type_enum_file = os.getenv("DJANGO_MODULE_TYPE_ENUM_FILE")
    with open(module_type_enum_file, "w") as f:
        f.write(output)
