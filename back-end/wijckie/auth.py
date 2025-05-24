from django.contrib.auth import login as django_login, logout as django_logout
from django.contrib.auth.forms import AuthenticationForm
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.csrf import ensure_csrf_cookie
from wijckie.responses import response_form_errors, response_ok


@require_GET
@ensure_csrf_cookie
def csrf(_):
    return response_ok()


@require_POST
def login(request):
    form = AuthenticationForm(data=request.POST)
    if not form.is_valid():
        return response_form_errors(form)

    user = form.get_user()
    django_login(request, user, backend="django.contrib.auth.backends.ModelBackend")

    return response_ok()


@require_GET
def me(request):
    if not request.user.is_authenticated:
        return JsonResponse({"authenticated": False})

    user = request.user
    return JsonResponse(
        {
            "authenticated": True,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
        }
    )


@require_POST
def logout(request):
    django_logout(request)
    return response_ok()
