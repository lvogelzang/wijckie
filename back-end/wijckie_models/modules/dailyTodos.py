from django.core.validators import MinLengthValidator
from django.db import models
from django.utils import timezone
from ..user import User
from ..module import ModuleType


class DailyTodoItemStatus(models.TextChoices):
    TODO = "todo"
    SKIP = "skip"
    DONE = "done"


class DailyTodosModule(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    type = ModuleType.DAILY_TODO
    name = models.CharField(max_length=30, validators=[MinLengthValidator(1)])

    class Meta:
        ordering = ["user", "name", "id"]


class DailyTodoOption(models.Model):
    module = models.ForeignKey(DailyTodosModule, on_delete=models.CASCADE)
    name = models.CharField(max_length=30, validators=[MinLengthValidator(1)])
    text = models.TextField()

    class Meta:
        ordering = ["module", "name", "id"]


class DailyTodoItem(models.Model):
    module = models.ForeignKey(DailyTodosModule, on_delete=models.CASCADE)
    date = models.DateField()
    option = models.ForeignKey(DailyTodoOption, on_delete=models.CASCADE)
    status = models.CharField(max_length=30, choices=DailyTodoItemStatus.choices)

    class Meta:
        unique_together = ("module", "date")
        ordering = ["module", "date", "option", "id"]


class DailyTodoWidget(models.Model):
    module = models.ForeignKey(DailyTodosModule, on_delete=models.CASCADE)
    name = models.CharField(max_length=30, validators=[MinLengthValidator(1)])

    class Meta:
        ordering = ["module", "name", "id"]
