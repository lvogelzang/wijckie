import json
import os
from os.path import join

from jinja2 import Environment, FileSystemLoader

from generate.definitions.model_definitions import ModelDefinitions
from generate.utils.naming import to_camel, to_pascal
from generate.utils.python import PythonImportMap


def generate_django_models(module_name):
    definitions_dir = os.getenv("MODULE_DEFINITIONS_DIRECTORY")
    f = open(join(definitions_dir, f"{module_name}.json"))
    content = json.loads(f.read())
    models = ModelDefinitions.from_dict(content)

    _generate_models(module_name, models)


def _generate_models(module_name, models):
    env = Environment(loader=FileSystemLoader("templates"))
    tmpl = env.get_template("module_models.jinja2")

    context = {
        "imports": _get_imports(module_name, models),
        "classes": _get_classes(models),
        "functions": [],
    }

    output = tmpl.render(**context)

    file = os.path.join(
        os.getenv("DJANGO_MODULE_MODELS_DIRECTORY"), f"{module_name}.py"
    )
    with open(file, "w") as f:
        f.write(output)


def _get_imports(module_name: str, models: ModelDefinitions):
    imports = PythonImportMap()
    imports.add_import("django.db", "models")

    for model in models.all_models():
        for field in model.fields:
            imports.add_imports_for_paths(field.get_imports())

    own_file = f"wijckie_models.modules.{to_camel(module_name)}"

    return imports.to_python_lines(own_file)


def _get_classes(models):
    classes = []
    for model in models.all_models():
        classes.append(
            {
                "name": to_pascal(model.name),
                "fields": list(map(lambda f: f.to_python_model_field(), model.fields)),
                "ordering": f"ordering = [{ ", ".join(list(map(lambda o: f"\"{o}\"", model.ordering))) }]",
            }
        )

    return classes
