from generate.definition.editing_mode import EditingMode


def enum_input(name, enum, suggestions, default_value=None):
    options = [e.value for e in enum]

    suggested_input = suggestions.get(
        name, default_value.value if default_value is not None else options[0]
    )
    prompt = f'   Enter {name.replace("_", " ")} {options} ("{suggested_input}"): '
    input_value = input(prompt)
    value = input_value if len(input_value) > 0 else suggested_input

    if value not in options:
        raise Exception(f"Unknown enum value: {value} for options {options}")

    return enum(value)


def editing_mode_input(suggestions):
    return enum_input("editing_mode", EditingMode, suggestions, EditingMode.READ_WRITE)
