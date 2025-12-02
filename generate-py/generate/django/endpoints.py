import json
import os
from os.path import join

from jinja2 import Environment, FileSystemLoader

from generate.definition.model_definitions import ModelDefinitions
from generate.utils.naming import to_camel, to_pascal
from generate.utils.python import PythonImportMap


def generate_django_endpoints(module_name):
    definitions_dir = os.getenv("MODULE_DEFINITIONS_DIRECTORY")
    f = open(join(definitions_dir, f"{module_name}.json"))
    content = json.loads(f.read())
    models = ModelDefinitions.from_dict(content)

    _generate_endpoints(module_name, models)


def _generate_endpoints(module_name, models):
    env = Environment(loader=FileSystemLoader("templates"))
    tmpl = env.get_template("module_endpoints.jinja2")

    context = {
        "imports": _get_imports(module_name, models),
        "classes": _get_classes(module_name, models),
    }

    output = tmpl.render(**context)

    file = os.path.join(
        os.getenv("DJANGO_MODULE_ENDPOINTS_DIRECTORY"), f"{module_name}.py"
    )
    with open(file, "w") as f:
        f.write(output)


def _get_imports(module_name, models):
    imports = PythonImportMap()
    imports.add_imports("rest_framework", ["mixins", "serializers", "viewsets"])
    imports.add_imports(
        f"wijckie_models.modules.{to_camel(module_name)}",
        list(map(lambda m: to_pascal(m.name), models.all_models())),
    )

    for model in models.all_models():
        for field in model.get_django_serializer_fields():
            imports.add_imports_for_paths(field.get_django_serializer_imports())

    own_file = f"wijckie.modules.{to_camel(module_name)}"
    return imports.to_python_lines(own_file)


def _get_classes(module_name, models):
    classes = []
    for model in models.all_models():
        fields = model.get_django_serializer_fields()
        filterset_fields = []
        filterset_fields.extend(
            list(map(lambda f: f["arg"], model.get_initial_query_filters()))
        )
        filterset_fields.extend(
            list(map(lambda f: f["arg"], model.get_optional_query_filters()))
        )
        filterset_fields = list(filter(lambda f: f != "user", filterset_fields))

        create_fields = list(
            filter(
                lambda f: f.include_in_create(), model.get_django_serializer_fields()
            )
        )
        classes.append(
            {
                "name": f"{to_pascal(model.name)}",
                "fieldNames": ", ".join(
                    list(map(lambda f: f'"{to_camel(f.name)}"', fields))
                ),
                "fields": list(
                    map(lambda f: f.to_django_serializer_field(False), fields)
                ),
                "createFieldNames": ", ".join(
                    list(map(lambda f: f'"{to_camel(f.name)}"', create_fields))
                ),
                "createFields": list(
                    map(lambda f: f.to_django_serializer_field(True), create_fields)
                ),
                "addUserToCreate": any(f.name == "user" for f in fields),
                "filtersetFields": ", ".join(
                    list(map(lambda f: f'"{f}"', filterset_fields))
                ),
                "initialFilters": ", ".join(
                    list(
                        map(
                            lambda f: f"{f["modelPath"]}={f["arg"]}",
                            model.get_initial_query_filters(),
                        )
                    )
                ),
                "optionalFilters": model.get_optional_query_filters(),
            }
        )

    return classes
