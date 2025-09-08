from wijckie_models.modules.dailyTodos import DailyTodoItem


class DailyTodoItemFactory:
    def __init__(self, module):
        self.module = module

    def create(self, date, option, status):
        widget = DailyTodoItem(
            module=self.module, date=date, option=option, status=status
        )
        widget.save()
        return widget
