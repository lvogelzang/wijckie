from typing import Dict

from allauth.mfa.adapter import DefaultMFAAdapter
from django.conf import settings


class MFAAdapter(DefaultMFAAdapter):

    def get_public_key_credential_rp_entity(self) -> Dict[str, str]:
        name = self._get_site_name()
        return {
            "id": settings.SESSION_COOKIE_DOMAIN,
            "name": name,
        }
