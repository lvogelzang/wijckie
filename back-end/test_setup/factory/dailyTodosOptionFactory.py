from wijckie_models.modules.dailyTodos import DailyTodoOption


class DailyTodosOptionFactory:
    def __init__(self, module):
        self.module = module

    def create(self, name, text):
        option = DailyTodoOption(module=self.module, name=name, text=text)
        option.save()
        return option
