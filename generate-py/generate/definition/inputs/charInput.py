def char_input(name, suggestions, example):
    suggested_input = suggestions.get(name, None)

    prompt = f"   Enter {name.replace("_", " ")}"
    if suggested_input is not None:
        prompt += f' ("{suggested_input}")'
    elif example is not None:
        prompt += f' (e.g: "{example}")'
    else:
        suggested_input = ""
        prompt += f' ("{suggested_input}")'
    prompt += ": "

    input_value = input(prompt)
    return input_value if len(input_value) > 0 else suggested_input
