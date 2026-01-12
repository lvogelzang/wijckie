from generate.definition.fields.id import Id
from generate.definition.model_field_types import ModelFieldFactory
from generate.utils.naming import from_camel, to_snake


class ModelClass:
    def __init__(
        self,
        name,
        short_name,
        plural_name,
        short_plural_name,
        translations,
        fields,
        ordering,
        initial_query_filters,
        optional_query_filters,
    ):
        self.name = name
        self.short_name = short_name
        self.plural_name = plural_name
        self.short_plural_name = short_plural_name
        self.translations = translations
        self.fields = fields
        self.ordering = ordering
        self.initial_query_filters = initial_query_filters
        self.optional_query_filters = optional_query_filters

    # Serialize

    def from_dict(dict):
        return ModelClass(
            name=dict["name"],
            short_name=dict["shortName"],
            plural_name=dict["pluralName"],
            short_plural_name=dict["shortPluralName"],
            translations=dict["translations"],
            fields=list(map(lambda d: ModelFieldFactory.from_dict(d), dict["fields"])),
            ordering=dict["ordering"],
            initial_query_filters=dict["initialQueryFilters"],
            optional_query_filters=dict["optionalQueryFilters"],
        )

    def to_dict(self):
        return {
            "name": self.name,
            "shortName": self.short_name,
            "pluralName": self.plural_name,
            "shortPluralName": self.short_plural_name,
            "translations": self.translations,
            "fields": list(map(lambda f: f.to_dict(), self.fields)),
            "ordering": self.ordering,
            "initialQueryFilters": self.initial_query_filters,
            "optionalQueryFilters": self.optional_query_filters,
        }

    # Django serializer

    def get_django_serializer_fields(self):
        fields = []
        fields.append(Id())
        fields.extend(self.fields)
        return fields

    def get_initial_query_filters(self):
        filters = []
        for filter in self.initial_query_filters:
            model_path = filter[0 : filter.index("=")]
            arg = filter[filter.index("=") + 1 : len(filter)]
            if arg != "user":
                arg = f'self.request.query_params.get("{arg}")'
            filters.append(
                {
                    "modelPath": model_path,
                    "arg": arg,
                }
            )
        return filters

    def get_optional_query_filters(self):
        filters = []
        for filter in self.optional_query_filters:
            model_path = filter[0 : filter.index("=")]
            arg = filter[filter.index("=") + 1 : len(filter)]
            filters.append(
                {
                    "pythonVarName": to_snake(from_camel(arg)),
                    "modelPath": model_path,
                    "arg": arg,
                }
            )
        return filters
