from django.utils.deprecation import MiddlewareMixin
from wijckie.responses import response_ok


class HealthCheckMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.META["PATH_INFO"] == "/health/":
            return response_ok()
