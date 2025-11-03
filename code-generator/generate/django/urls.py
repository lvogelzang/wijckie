import ast
import json
import os
from os.path import join

from jinja2 import Environment, FileSystemLoader

from generate.definitions.model_definitions import ModelDefinitions
from generate.utils.naming import to_camel, to_dashed, to_pascal
from generate.utils.python import PythonImportMap


def generate_django_urls(module_name):
    definitions_dir = os.getenv("MODULE_DEFINITIONS_DIRECTORY")
    f = open(join(definitions_dir, f"{module_name}.json"))
    content = json.loads(f.read())
    models = ModelDefinitions.from_dict(content)

    env = Environment(loader=FileSystemLoader("templates"))
    tmpl = env.get_template("urls.jinja2")

    context = {
        "imports": _get_imports(module_name, models),
        "viewsets": _get_viewsets(module_name, models).to_template_list(),
    }

    output = tmpl.render(**context)

    file = os.getenv("DJANGO_URLS_FILE")
    with open(file, "w") as f:
        f.write(output)


def _get_imports(module_name, models):
    imports = PythonImportMap()
    imports.add_import("django.conf", "settings")
    imports.add_import("django.conf.urls.static", "static")
    imports.add_imports("django.urls", ["include", "path"])
    imports.add_imports(
        "drf_spectacular.views", ["SpectacularAPIView", "SpectacularRedocView"]
    )
    imports.add_imports("rest_framework", ["routers", "serializers", "viewsets"])
    imports.add_import("wijckie.csrf", "csrf")
    imports.add_imports("wijckie.fileUpload", ["FileUploadViewSet", "dev_file_upload"])
    imports.add_import("wijckie.modules.widgets", "WidgetsViewSet")
    imports.add_import("wijckie_models.models", "User")

    module_viewset_imports = _get_current_module_viewset_imports()
    for from_part, imports_part in module_viewset_imports:
        imports.add_imports(from_part, imports_part)

    imports.add_imports(
        f"wijckie.modules.{to_camel(module_name)}",
        list(map(lambda m: f"{to_pascal(m.name)}ViewSet", models.all_models())),
    )

    own_file = "wijckie.urls"
    return imports.to_python_lines(own_file)


def _get_current_module_viewset_imports():
    urls_file = os.getenv("DJANGO_URLS_FILE")
    f = open(urls_file)
    tree = ast.parse(f.read())

    results = []
    for node in ast.walk(tree):
        if (
            isinstance(node, ast.ImportFrom)
            and node.module
            and node.module.startswith("wijckie.modules.")
        ):
            results.append((node.module, [alias.name for alias in node.names]))

    return results


def _get_viewsets(module_name, models):
    viewset_map = _get_current_viewsets()

    for model in models.all_models():
        viewset_map.add_view_set(
            to_dashed(model.plural_name), f"{to_pascal(model.name)}ViewSet"
        )

    return viewset_map


def _get_current_viewsets():
    urls_file = os.getenv("DJANGO_URLS_FILE")
    f = open(urls_file)
    tree = ast.parse(f.read())

    view_sets = []
    for node in ast.walk(tree):
        if (
            isinstance(node, ast.ImportFrom)
            and node.module
            and node.module.startswith("wijckie.modules.")
        ):
            for alias in node.names:
                view_sets.append(alias.name)

    results = ViewSetMap()
    for node in ast.walk(tree):
        if isinstance(node, ast.Call):
            func = node.func
            if (
                isinstance(func, ast.Attribute)
                and func.attr == "register"
                and isinstance(func.value, ast.Name)
                and func.value.id == "router"
            ):
                args = node.args
                kwargs = {kw.arg: kw.value for kw in node.keywords}

                if len(args) >= 2 and isinstance(args[1], ast.Name):
                    viewset_name = args[1].id
                    if viewset_name in view_sets:
                        basename = None
                        if "basename" in kwargs and isinstance(
                            kwargs["basename"], ast.Constant
                        ):
                            basename = kwargs["basename"].value
                        results.add_view_set(basename, viewset_name)

    return results


class ViewSetMap:
    def __init__(self):
        self.map = {}

    def add_view_set(self, basename, viewset_name):
        self.map[basename] = viewset_name

    def to_template_list(self):
        items = []

        for basename, viewset_name in self.map.items():
            items.append({"basename": basename, "viewset": viewset_name})

        items.sort(key=lambda i: i["basename"])

        return items
