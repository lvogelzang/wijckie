from django.conf import settings
from django.contrib.staticfiles.storage import StaticFilesStorage
from storages.backends.s3 import S3StaticStorage


class StaticStorage(S3StaticStorage):
    def __init__(self, *args, **kwargs):
        kwargs["bucket_name"] = settings.AWS_STATIC_BUCKET_NAME
        super(S3StaticStorage, self).__init__(*args, **kwargs)


# Default static files storage system, enforcing absolute URLs for development.
class DevStaticStorage(StaticFilesStorage):
    def __init__(self, *args, **kwargs):
        if settings.DEBUG != True:
            raise Exception()

        kwargs["base_url"] = "%s/%s" % (
            settings.BACKEND_HOST,
            settings.STATIC_URL,
        )
        super(DevStaticStorage, self).__init__(*args, **kwargs)
