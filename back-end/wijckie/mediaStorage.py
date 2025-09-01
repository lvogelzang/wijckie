from django.conf import settings
from django.core.files.storage import FileSystemStorage
from storages.backends.s3 import S3Storage
from wijckie.utils import add_protocol
from wijckie_models.models import FileUpload


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

    def generate_upload_url(self, file_upload: FileUpload):
        return "%s/%s?file_uuid=%s&file_name=%s" % (
            add_protocol(settings.USE_TLS, settings.BACKEND_HOST),
            settings.MEDIA_UPLOAD_URL,
            file_upload.file_uuid,
            file_upload.file_name,
        )


class S3MediaStorage(S3Storage):
    def generate_upload_url(self, file_upload: FileUpload):
        return self.bucket.meta.client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                "Key": f"{file_upload.file_uuid}/{file_upload.file_name}",
            },
            ExpiresIn=300,
        )
