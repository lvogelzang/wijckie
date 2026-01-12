def number_input(name, suggestions, default_value):
    fallback_value = "" if default_value is None else default_value
    suggested_input = str(suggestions.get(name, fallback_value))
    input_value = input(f'   Enter {name.replace("_", " ")} ("{suggested_input}"): ')
    return int(input_value) if len(input_value) > 0 else int(suggested_input)
