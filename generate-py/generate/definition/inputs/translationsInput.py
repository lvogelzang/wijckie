import os


def field_translations_input(name, suggestions):
    translations = {}

    suggested_translations = suggestions.get("translations", {})
    for locale in os.getenv("LOCALES").split(","):
        suggestions_for_locale = suggested_translations.get(locale, {})
        suggested_localized_name = suggestions_for_locale.get(
            "name", name if locale == "en_GB" else ""
        )
        localized_name = input(
            f'  Enter localized name for locale {locale} ("{suggested_localized_name}"): '
        )
        localized_name = (
            localized_name if len(localized_name) > 0 else suggested_localized_name
        )
        translations[locale] = {"name": localized_name}

    return translations


def model_translations_input(name, plural_name):
    translations = {}

    for locale in os.getenv("LOCALES").split(","):
        suggested_localized_singular_name = name if locale == "en_GB" else ""
        localized_singular_name = input(
            f'Enter localized singular name for locale {locale} ("{suggested_localized_singular_name}"): '
        )
        localized_singular_name = (
            localized_singular_name
            if len(localized_singular_name) > 0
            else suggested_localized_singular_name
        )

        suggested_localized_plural_name = plural_name if locale == "en_GB" else ""
        localized_plural_name = input(
            f'Enter localized plural name for locale {locale} ("{suggested_localized_plural_name}"): '
        )
        localized_plural_name = (
            localized_plural_name
            if len(localized_plural_name) > 0
            else suggested_localized_plural_name
        )

        translations[locale] = {
            "singular name": localized_singular_name,
            "plural name": localized_plural_name,
        }

    return translations
