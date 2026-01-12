def boolean_input(name, suggestions, default_value=True):
    suggested_input = str(suggestions.get(name, default_value)).lower()
    input_value = input(f'   Enter {name.replace("_", " ")} ("{suggested_input}"): ')
    return input_value == "true" if len(input_value) > 0 else suggested_input == "true"


def optional_input(suggestions):
    return boolean_input("optional", suggestions, False)
