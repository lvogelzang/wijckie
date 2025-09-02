from django.db import models


class ModuleType(models.TextChoices):
    INSPIRATION = "inspiration"
    DAILY_TODO = "daily_todo"
