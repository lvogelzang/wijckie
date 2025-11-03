import dataclasses
from typing import Dict, Optional

from allauth.account.adapter import DefaultAccountAdapter
from allauth.account.models import EmailAddress
from allauth.account.utils import user_display, user_username
from allauth.headless.adapter import DefaultHeadlessAdapter
from allauth.mfa.adapter import DefaultMFAAdapter
from django.conf import settings
from wijckie_models.models import Language, TimeZone


class MFAAdapter(DefaultMFAAdapter):
    def get_public_key_credential_rp_entity(self) -> Dict[str, str]:
        name = self._get_site_name()
        return {
            "id": settings.SESSION_COOKIE_DOMAIN,
            "name": name,
        }

    def is_mfa_enabled(self, user, types=None) -> bool:
        return False


class AccountAdapter(DefaultAccountAdapter):
    def new_user(self, request):
        user = super().new_user(request)
        user.language = Language.NL
        user.time_zone = TimeZone.EUROPE_AMSTERDAM

        return user


class HeadlessAdapter(DefaultHeadlessAdapter):
    def user_as_dataclass(self, user):
        UserDc = self.get_user_dataclass()
        kwargs = {}
        if user.pk:
            id = user.pk
            email = EmailAddress.objects.get_primary_email(user)
        else:
            id = None
            email = None
        kwargs.update(
            {
                "id": id,
                "display": user_display(user),
                "email": email if email else None,
                "username": user_username(user),
                "language": user.language,
                "timeZone": user.time_zone,
            }
        )
        return UserDc(**kwargs)

    def get_user_dataclass(self):
        fields = []

        def dc_field(attr, typ, description, example):
            return (
                attr,
                typ,
                dataclasses.field(
                    metadata={
                        "description": description,
                        "example": example,
                    }
                ),
            )

        fields.extend(
            [
                dc_field("id", Optional[int], "The user ID.", 123),
                dc_field(
                    "display", str, "The display name for the user.", "Magic Wizard"
                ),
                dc_field(
                    "email", Optional[str], "The email address.", "j.test@example.com"
                ),
                dc_field("username", str, "The username.", "wizard"),
                dc_field("language", str, "The preferred language.", "nl"),
                dc_field(
                    "timeZone", str, "The preferred time zone.", "Europe/Amsterdam"
                ),
            ]
        )
        return dataclasses.make_dataclass("User", fields)
