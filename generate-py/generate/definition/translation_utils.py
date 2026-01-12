import os

predefined_field_translations = {
    "user": {"nl": {"name": "gebruiker"}, "en_GB": {"name": "user"}},
    "name": {"nl": {"name": "naam"}, "en_GB": {"name": "name"}},
    "created at": {"nl": {"name": "aangemaakt"}, "en_GB": {"name": "created"}},
    "id": {"nl": {"name": "ID"}, "en_GB": {"name": "ID"}},
    "order": {"nl": {"name": "volgorde"}, "en_GB": {"name": "order"}},
    "module": {"nl": {"name": "module"}, "en_GB": {"name": "module"}},
    "widget": {"nl": {"name": "widget"}, "en_GB": {"name": "widget"}},
}


def get_predefined_field_translations(name):
    translations = {}

    locales = os.getenv("LOCALES").split(",")
    for locale in locales:
        translations[locale] = predefined_field_translations[name][locale]

    return translations
