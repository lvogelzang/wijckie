from test_setup.factory.uploadFactory import UploadFactory
from wijckie_models.fileUpload import FieldReference, FileUpload
from wijckie_models.modules.inspiration import InspirationOption, InspirationOptionType


class InspirationOptionFactory:
    def __init__(self, module):
        self.module = module
        self.upload_factory = UploadFactory(module.user)

    def create_text(self, name, text):
        option = InspirationOption(
            module=self.module, name=name, type=InspirationOptionType.TEXT, text=text
        )
        option.save()
        return option

    def create_image(self, name, file_uuid, file_name):
        upload = self.upload_factory.create(
            file_uuid, file_name, FieldReference.INSPIRATION_OPTION_IMAGE
        )
        option = InspirationOption(
            module=self.module,
            name=name,
            type=InspirationOptionType.IMAGE,
            image=upload,
        )
        option.save()
        return option
