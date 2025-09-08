from wijckie_models.modules.dailyTodos import DailyTodosModule


class DailyTodosModuleFactory:
    def __init__(self, user):
        self.user = user

    def create(self, name):
        module = DailyTodosModule(user=self.user, name=name)
        module.save()
        return module
