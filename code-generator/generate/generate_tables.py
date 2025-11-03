from dotenv import load_dotenv

from generate.react.generate_tables import generate_react_tables
from generate.utils.naming import get_all_module_names

load_dotenv()


try:
    module_name = input(
        'Enter module name (e.g: "daily todo" or leave empty to do all): '
    )
    module_names = [module_name] if len(module_name) > 0 else get_all_module_names()
    for module_name in module_names:
        generate_react_tables(module_name)
except KeyboardInterrupt:
    pass
