from wijckie_models.modules.inspiration import InspirationWidget


class InspirationWidgetFactory:
    def __init__(self, module):
        self.module = module

    def create(self, name):
        widget = InspirationWidget(module=self.module, name=name)
        widget.save()
        return widget
