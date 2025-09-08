from wijckie_models.modules.inspiration import InspirationItem


class InspirationItemFactory:
    def __init__(self, module):
        self.module = module

    def create(self, date, option):
        widget = InspirationItem(module=self.module, date=date, option=option)
        widget.save()
        return widget
