from wijckie_models.modules.dailyTodos import DailyTodosWidget


class DailyTodosWidgetFactory:
    def __init__(self, module):
        self.module = module

    def create(self, name):
        widget = DailyTodosWidget(module=self.module, name=name)
        widget.save()
        return widget
