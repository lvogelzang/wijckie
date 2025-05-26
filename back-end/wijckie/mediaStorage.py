from django.conf import settings
from django.core.files.storage import FileSystemStorage
from wijckie.utils import add_protocol


# Default storage system, enforcing absolute URLs for development.
class DevMediaStorage(FileSystemStorage):
    def __init__(self, *args, **kwargs):
        if settings.DEBUG != True:
            raise Exception()

        kwargs["base_url"] = "%s/%s" % (
            add_protocol(settings.USE_TLS, settings.BACKEND_HOST),
            settings.MEDIA_URL,
        )
        super(DevMediaStorage, self).__init__(*args, **kwargs)
