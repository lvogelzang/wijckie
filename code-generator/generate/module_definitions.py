import json

from dotenv import load_dotenv

from generate.definitions.create_model_utils import create_models

load_dotenv()

try:
    module_name = input('Enter module name (e.g: "daily todo"): ')
    if len(module_name) == 0:
        raise Exception("No name submitted")

    models = create_models(module_name)

    file_name = f"modules/{module_name}.json"
    with open(file_name, "w") as f:
        content = json.dumps(models.to_dict(), indent=2)
        f.write(content)
        print(f"Written output to {file_name}")


except KeyboardInterrupt:
    pass
