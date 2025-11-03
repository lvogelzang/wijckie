from dotenv import load_dotenv

from generate.django.generate_models import generate_django_models
from generate.django.models_import import add_models_import
from generate.django.module_type_enum import add_module_type_enum
from generate.utils.naming import get_all_module_names

load_dotenv()


try:
    module_name = input(
        'Enter module name (e.g: "daily todo" or leave empty to do all): '
    )
    module_names = [module_name] if len(module_name) > 0 else get_all_module_names()
    for module_name in module_names:
        generate_django_models(module_name)
        add_module_type_enum(module_name)
        add_models_import(module_name)
except KeyboardInterrupt:
    pass
