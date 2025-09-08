from wijckie_models.modules.inspiration import InspirationModule


class InspirationModuleFactory:
    def __init__(self, user):
        self.user = user

    def create(self, name):
        module = InspirationModule(user=self.user, name=name)
        module.save()
        return module
