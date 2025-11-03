from pathlib import Path

from configurations import Configuration
from decouple import config
from wijckie.utils import add_protocol


class Base(Configuration):
    SECRET_KEY = config("SECRET_KEY")
    SITE_ID = 1

    FRONTEND_HOST = config("FRONTEND_HOST")
    BACKEND_HOST = config("BACKEND_HOST")
    ALLOWED_HOSTS = [FRONTEND_HOST, BACKEND_HOST]

    CORS_ALLOW_CREDENTIALS = True
    CSRF_COOKIE_DOMAIN = config("COOKIE_DOMAIN")
    SESSION_COOKIE_DOMAIN = config("COOKIE_DOMAIN")

    @property
    def CSRF_TRUSTED_ORIGINS(self):
        return [
            add_protocol(self.USE_TLS, self.FRONTEND_HOST),
            add_protocol(self.USE_TLS, self.BACKEND_HOST),
        ]

    @property
    def CORS_ALLOWED_ORIGINS(self):
        return [
            add_protocol(self.USE_TLS, self.FRONTEND_HOST),
            add_protocol(self.USE_TLS, self.BACKEND_HOST),
        ]

    SESSION_COOKIE_SECURE = False

    INSTALLED_APPS = [
        "django.contrib.auth",
        "django.contrib.contenttypes",
        "django.contrib.sessions",
        "django.contrib.sites",
        "django.contrib.messages",
        "django.contrib.staticfiles",
        "corsheaders",
        "wijckie_models",
        "allauth",
        "allauth.account",
        "allauth.mfa",
        "allauth.headless",
        "rest_framework",
        "django_filters",
        "drf_spectacular",
        "drf_standardized_errors",
    ]

    MIDDLEWARE = [
        "wijckie.middleware.HealthCheckMiddleware",
        "django.middleware.security.SecurityMiddleware",
        "corsheaders.middleware.CorsMiddleware",
        "django.contrib.sessions.middleware.SessionMiddleware",
        "django.middleware.common.CommonMiddleware",
        "django.middleware.csrf.CsrfViewMiddleware",
        "django.contrib.auth.middleware.AuthenticationMiddleware",
        "django.contrib.messages.middleware.MessageMiddleware",
        "django.middleware.clickjacking.XFrameOptionsMiddleware",
        "allauth.account.middleware.AccountMiddleware",
    ]

    ROOT_URLCONF = "wijckie.urls"

    TEMPLATES = [
        {
            "BACKEND": "django.template.backends.django.DjangoTemplates",
            "DIRS": [],
            "APP_DIRS": True,
            "OPTIONS": {
                "context_processors": [
                    "django.template.context_processors.request",
                    "django.contrib.auth.context_processors.auth",
                    "django.contrib.messages.context_processors.messages",
                ],
            },
        },
    ]

    WSGI_APPLICATION = "wijckie.wsgi.application"

    AUTH_USER_MODEL = "wijckie_models.User"

    AUTH_PASSWORD_VALIDATORS = [
        {
            "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
        },
        {
            "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        },
        {
            "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
        },
        {
            "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
        },
    ]

    LANGUAGE_CODE = "en-us"

    TIME_ZONE = "UTC"

    USE_I18N = True

    USE_TZ = True

    STATIC_URL = "static/"

    DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

    EMAIL_USE_TLS = config("DJANGO_EMAIL_USE_TLS", True, cast=bool)
    EMAIL_HOST = config("DJANGO_EMAIL_HOST", "")
    EMAIL_HOST_USER = config("DJANGO_EMAIL_HOST_USER", "")
    EMAIL_HOST_PASSWORD = config("DJANGO_EMAIL_HOST_PASSWORD", "")
    EMAIL_PORT = config("DJANGO_EMAIL_PORT", 587)
    DEFAULT_FROM_EMAIL = config("DJANGO_DEFAULT_FROM_EMAIL", "")

    AUTHENTICATION_BACKENDS = ["allauth.account.auth_backends.AuthenticationBackend"]

    ACCOUNT_ADAPTER = "wijckie.adapters.AccountAdapter"
    MFA_ADAPTER = "wijckie.adapters.MFAAdapter"
    HEADLESS_ADAPTER = "wijckie.adapters.HeadlessAdapter"

    ACCOUNT_EMAIL_VERIFICATION = "mandatory"
    ACCOUNT_LOGIN_METHODS = {"email"}
    ACCOUNT_LOGIN_BY_CODE_ENABLED = True
    ACCOUNT_EMAIL_VERIFICATION_BY_CODE_ENABLED = True
    ACCOUNT_SIGNUP_FIELDS = ["email*"]

    HEADLESS_ONLY = True
    HEADLESS_SERVE_SPECIFICATION = True

    @property
    def HEADLESS_FRONTEND_URLS(self):
        return {
            "account_confirm_email": add_protocol(self.USE_TLS, self.FRONTEND_HOST)
            + "/account/verify-email/{key}",
            "account_reset_password": add_protocol(self.USE_TLS, self.FRONTEND_HOST)
            + "/account/password/reset",
            "account_reset_password_from_key": add_protocol(
                self.USE_TLS, self.FRONTEND_HOST
            )
            + "/account/password/reset/key/{key}",
            "account_signup": add_protocol(self.USE_TLS, self.FRONTEND_HOST)
            + "/account/signup",
            "socialaccount_login_error": add_protocol(self.USE_TLS, self.FRONTEND_HOST)
            + "/account/provider/callback",
        }

    MFA_SUPPORTED_TYPES = ["webauthn"]
    MFA_PASSKEY_LOGIN_ENABLED = True
    MFA_PASSKEY_SIGNUP_ENABLED = True
    PASSKEY_SIGNUP_ENABLED = True
    PASSKEY_LOGIN_ENABLED = True

    REST_FRAMEWORK = {
        "DEFAULT_FILTER_BACKENDS": [
            "django_filters.rest_framework.DjangoFilterBackend"
        ],
        "DEFAULT_PAGINATION_CLASS": "wijckie.pagination.DefaultPagination",
        "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
        "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
        "EXCEPTION_HANDLER": "drf_standardized_errors.handler.exception_handler",
        "PAGE_SIZE": 10,
    }

    SPECTACULAR_SETTINGS = {
        "TITLE": "Wijckie API",
        "DESCRIPTION": "Default API for Wijckie",
        "VERSION": "1.0.0",
        "SERVE_INCLUDE_SCHEMA": False,
        "EXTERNAL_DOCS": {"description": "allauth", "url": "/_allauth/openapi.html"},
    }

    LOGGING = {
        "version": 1,
        "disable_existing_loggers": False,
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
            },
        },
        "root": {
            "handlers": ["console"],
            "level": "INFO",
        },
    }


class Dev(Base):
    DEBUG = True
    USE_TLS = False
    ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
    CSRF_COOKIE_SECURE = False
    BASE_DIR = Path(__file__).resolve().parent.parent

    ACCOUNT_RATE_LIMITS = False

    STATIC_URL = "static/"
    STATIC_ROOT = "static/"
    MEDIA_URL = "media/"
    MEDIA_UPLOAD_URL = "upload/"
    MEDIA_ROOT = BASE_DIR / "media"
    STORAGES = {
        "default": {"BACKEND": "wijckie.mediaStorage.DevMediaStorage"},
        "staticfiles": {"BACKEND": "wijckie.staticStorage.DevStaticStorage"},
    }

    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }


class Prod(Base):
    DEBUG = False
    USE_TLS = True
    CSRF_COOKIE_SECURE = True

    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": config("DJANGO_DATABASE_NAME", ""),
            "USER": config("DJANGO_DATABASE_USER", ""),
            "PASSWORD": config("DJANGO_DATABASE_PASSWORD", ""),
            "HOST": config("DJANGO_DATABASE_HOST", ""),
            "PORT": config("DJANGO_DATABASE_PORT", ""),
        }
    }

    AWS_ACCESS_KEY_ID = config("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY = config("AWS_SECRET_ACCESS_KEY", "")
    AWS_STORAGE_BUCKET_NAME = config("AWS_STORAGE_BUCKET_NAME", "")
    AWS_STATIC_BUCKET_NAME = config("AWS_STATIC_BUCKET_NAME", "")
    AWS_S3_REGION_NAME = config("AWS_S3_REGION_NAME", "")
    AWS_SES_REGION_NAME = config("AWS_SES_REGION_NAME", "")
    AWS_S3_OBJECT_PARAMETERS = {"CacheControl": "max-age=86400"}
    AWS_DEFAULT_ACL = None
    AWS_QUERYSTRING_EXPIRE = 3600
    STORAGES = {
        "default": {"BACKEND": "wijckie.mediaStorage.S3MediaStorage"},
        "staticfiles": {"BACKEND": "wijckie.staticStorage.StaticStorage"},
    }
