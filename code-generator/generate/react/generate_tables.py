import json
import os
from os.path import join

from jinja2 import Environment, FileSystemLoader

from generate.definitions.model_class import ModelClass
from generate.definitions.model_definitions import ModelDefinitions
from generate.utils.naming import strip_path, to_camel, to_pascal
from generate.utils.typescript import TypescriptImportMap


def generate_react_tables(module_name):
    definitions_dir = os.getenv("MODULE_DEFINITIONS_DIRECTORY")
    f = open(join(definitions_dir, f"{module_name}.json"))
    content = json.loads(f.read())
    models = ModelDefinitions.from_dict(content)

    _generate_tables(module_name, models)


def _generate_tables(module_name, models):
    env = Environment(loader=FileSystemLoader("templates"))
    tmpl = env.get_template("module_tables.jinja2")

    module_path = os.path.join(
        os.getenv("REACT_TABLES_DIRECTORY"), to_camel(module_name)
    )
    if not os.path.exists(module_path):
        os.makedirs(module_path)

    for model in models.all_models():
        context = {
            "imports": _get_imports(module_name, model),
            "cls": _get_table(module_name, model),
            # "functions": [],
        }

        output = tmpl.render(**context)

        file = os.path.join(module_path, f"{to_pascal(model.name)}Table.tsx")
        with open(file, "w") as f:
            f.write(output)


def _get_imports(module_name: str, model: ModelClass):
    imports = TypescriptImportMap()

    imports.add_import(
        f"use{to_pascal(model.plural_name)}List", "@/api/endpoints/api", is_nested=True
    )
    imports.add_import(
        to_pascal(model.name), "@/api/models/api", is_type=True, is_nested=True
    )
    for field in model.fields:
        if field.refers_to_parent():
            imports.add_import(
                strip_path(field.foreign_key_to),
                "@/api/models/api",
                is_type=True,
                is_nested=True,
            )
    imports.add_import("Table", "@/components/table/Table")
    imports.add_import(
        "TableButtonDef",
        "@/components/table/TableButtonDef",
        is_type=True,
        is_nested=True,
    )
    imports.add_import(
        "ColumnDef", "@tanstack/react-table", is_type=True, is_nested=True
    )
    imports.add_import("TitleStyle", "@/types/TitleStyle", is_type=True, is_nested=True)
    imports.add_import("useMemo", "react", is_nested=True)
    imports.add_import("useTranslation", "react-i18next", is_nested=True)
    imports.add_import("Link", "react-router-dom", is_nested=True)

    return imports.to_typescript_lines()


def _get_table(module_name: str, model: ModelClass):
    props = []
    props.append({"name": "titleStyle", "type": "TitleStyle"})
    for field in model.fields:
        if field.refers_to_parent():
            props.append(
                {
                    "name": f"{to_camel(field.name)}",
                    "type": f"{strip_path(field.foreign_key_to)}",
                }
            )

    query_args = []
    for field in model.fields:
        if field.refers_to_parent():
            query_args.append(f"{to_camel(field.name)}: {to_camel(field.name)}.id")

    columns = []
    for field in model.fields:
        if field.show_in_table():
            columns.append(field.to_table_lines(model.name))

    return {
        "modelNamePascal": to_pascal(model.name),
        "modelNamePascalPlural": to_pascal(model.plural_name),
        "hasParent": True,
        "props": props,
        "propList": ", ".join(list(map(lambda f: f["name"], props))),
        "queryArgs": f'{{ {", ".join(query_args)} }}' if len(query_args) > 0 else "",
        "columns": columns,
    }
