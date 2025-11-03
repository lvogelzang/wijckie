from dotenv import load_dotenv

from generate.django.urls import generate_django_urls
from generate.utils.naming import get_all_module_names

load_dotenv()


try:
    module_name = input(
        'Enter module name (e.g: "daily todo" or leave empty to do all): '
    )
    module_names = [module_name] if len(module_name) > 0 else get_all_module_names()
    for module_name in module_names:
        generate_django_urls(module_name)
except KeyboardInterrupt:
    pass
