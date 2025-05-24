from django.http import JsonResponse
from django.utils.html import escape


def response_ok():
    return JsonResponse({"status": "OK"})


def response_form_errors(form):
    data = {}

    for field in form.errors:
        data[field] = []
        for error in form.errors[field]:
            data[field].append(escape(error))

    data["nonFieldErrors"] = []
    for error in form.non_field_errors():
        data["nonFieldErrors"].append(error)

    return JsonResponse(data, status=400)
