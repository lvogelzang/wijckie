import uuid

from django.core.validators import MinLengthValidator
from django.db import models
from django.utils import timezone

from .user import User


class FieldReference(models.TextChoices):
    INSPIRATION_OPTION_IMAGE = "InspirationOption_image"


class FileUpload(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    file_uuid = models.UUIDField(default=uuid.uuid4)
    file_name = models.CharField(max_length=255, validators=[MinLengthValidator(1)])
    expected_reference = models.CharField(
        max_length=50,
        choices=FieldReference.choices,
        validators=[MinLengthValidator(1)],
    )

    class Meta:
        indexes = [
            models.Index(fields=["file_uuid"]),
            models.Index(fields=["expected_reference"]),
        ]
