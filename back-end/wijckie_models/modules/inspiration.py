from django.core.validators import MinLengthValidator
from django.db import models
from django.db.models import Q
from django.utils import timezone
from ..user import User
from ..module import ModuleType


class InspirationOptionType(models.TextChoices):
    TEXT = "text"
    IMAGE = "image"


class InspirationModule(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    type = ModuleType.INSPIRATION
    name = models.CharField(max_length=30, validators=[MinLengthValidator(1)])

    class Meta:
        ordering = ["user", "name", "id"]


class InspirationOption(models.Model):
    module = models.ForeignKey(InspirationModule, on_delete=models.CASCADE)
    name = models.CharField(max_length=30, validators=[MinLengthValidator(1)])
    type = models.TextField(choices=InspirationOptionType.choices)
    text = models.TextField(null=True)
    image = models.FileField(upload_to="inspiration", null=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=(~Q(type="text") | Q(text__isnull=False)),
                name="inspiration_option__text",
            ),
            models.CheckConstraint(
                check=(~Q(type="image") | Q(image__isnull=False)),
                name="inspiration_option__image",
            ),
        ]
        ordering = ["module", "type", "name", "id"]


class InspirationItem(models.Model):
    module = models.ForeignKey(InspirationModule, on_delete=models.CASCADE)
    date = models.DateField()
    option = models.ForeignKey(InspirationOption, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("module", "date")
        ordering = ["module", "date", "option", "id"]


class InspirationWidget(models.Model):
    module = models.ForeignKey(InspirationModule, on_delete=models.CASCADE)
    name = models.CharField(max_length=30, validators=[MinLengthValidator(1)])

    class Meta:
        ordering = ["module", "name", "id"]
