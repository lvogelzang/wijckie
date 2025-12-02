import ast
import os

from jinja2 import Environment, FileSystemLoader

from generate.utils.naming import to_camel


def add_models_import(module_name):
    values = _get_current_values()
    values = set(values)
    values.add(f".modules.{to_camel(module_name)}")
    _write(values)


def _get_current_values():
    models_file = os.getenv("DJANGO_MODULE_MODELS_FILE")
    f = open(models_file)
    tree = ast.parse(f.read())

    imports = []
    for node in ast.walk(tree):
        if isinstance(node, ast.ImportFrom):
            prefix = "." * node.level if node.level else ""
            imports.append(prefix + node.module)

    return imports


def _write(values):
    env = Environment(loader=FileSystemLoader("templates"))
    tmpl = env.get_template("models.jinja2")

    context = {"values": values}

    output = tmpl.render(**context)

    models_file = os.getenv("DJANGO_MODULE_MODELS_FILE")
    with open(models_file, "w") as f:
        f.write(output)
