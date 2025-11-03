from django import forms
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.validators import RegexValidator
from django.views.decorators.csrf import csrf_exempt
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema_field
from rest_framework import mixins, serializers, viewsets
from wijckie.responses import response_form_errors, response_ok
from wijckie_models.models import FileUpload


class FileUploadSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    createdAt = serializers.CharField(source="created_at", read_only=True)
    fileUUID = serializers.UUIDField(source="file_uuid", read_only=True)
    fileName = serializers.CharField(
        source="file_name",
        validators=[RegexValidator(regex='^[^<>:;,?"*|/]+$')],
    )
    fileUploadURL = serializers.SerializerMethodField("get_upload_url")

    @extend_schema_field(OpenApiTypes.STR)
    def get_upload_url(self, file_upload):
        return default_storage.generate_upload_url(file_upload)

    def create(self, validated_data):
        return FileUpload.objects.create(
            **validated_data, user=self.context["request"].user
        )

    class Meta:
        model = FileUpload
        fields = ["id", "user", "createdAt", "fileUUID", "fileName", "fileUploadURL"]


class FileUploadViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = FileUploadSerializer

    def get_queryset(self):
        return FileUpload.objects.none()


class UploadForm(forms.Form):
    file = forms.FileField()


# Endpoint to upload files in dev mode.
# Permission: none
@csrf_exempt
def dev_file_upload(request):
    if not settings.DEBUG:
        raise Exception("Use in debug mode only")

    form = UploadForm(request.POST, request.FILES)
    if not form.is_valid():
        return response_form_errors(form)

    file = form.cleaned_data["file"]
    file_uuid = request.GET.get("file_uuid")
    file_name = request.GET.get("file_name")
    default_storage.save(f"{file_uuid}/{file_name}", file)

    return response_ok()
