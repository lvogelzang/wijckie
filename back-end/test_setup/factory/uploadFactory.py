import os
import shutil

from wijckie_models.fileUpload import FileUpload


class UploadFactory:
    def __init__(self, user):
        self.user = user

    def create(self, file_uuid, file_name, expected_reference):
        upload = FileUpload(
            user=self.user,
            file_uuid=file_uuid,
            file_name=file_name,
            expected_reference=expected_reference,
        )
        upload.save()

        # Copy local file to media folder
        # Source: back-end/test_setup/test_media/file_uuid/file_name
        source = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "test_media",
            file_uuid,
            file_name,
        )
        # Target: back-end/media/file_uuid/file_name
        target = os.path.join(
            os.path.dirname(
                os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            ),
            "media",
            file_uuid,
            file_name,
        )
        os.makedirs(os.path.dirname(target), exist_ok=True)
        shutil.copyfile(source, target)

        return upload
