from generate.definitions.editing_mode import EditingMode
from generate.utils.naming import strip_path, to_camel, to_snake


class BaseModelField:
    type = "Not implemented!"
    editing_mode = "Not implemented!"

    def refers_to_parent(self):
        return False

    # Generate definitions

    def generate(name, suggestions):
        raise Exception("Not implemented!")

    # Serialize

    def from_dict(dict):
        raise Exception("Not implemented!")

    def to_dict(self):
        raise Exception("Not implemented!")

    # Django model

    django_model_class = "Not implemented!"

    def get_imports(self):
        imports = []
        if self.django_model_class is not None:
            imports.append(self.django_model_class)
        for validator in self.get_validators():
            imports.append(validator)
        return imports

    def get_args(self):
        return []

    def get_validators(self):
        return []

    def to_python_model_field(self):
        args = self.get_args()
        validators = list(map(lambda v: strip_path(v), self.get_validators()))
        if len(validators) > 0:
            args.append(f"validators=[{", ".join(validators)}]")

        return f"{to_snake(self.name)} = {strip_path(self.django_model_class)}({", ".join(args)})"

    # Django serializer

    django_serializer_class = "Not implemented!"

    def get_django_serializer_args(self, for_create):
        return []

    def to_django_serializer_field(self, for_create):
        args = self.get_django_serializer_args(for_create)
        if to_snake(self.name) != self.name:
            args.append(f'source="{to_snake(self.name)}"')

        if self.editing_mode == EditingMode.READ_ONLY:
            args.append("read_only=True")
        elif self.editing_mode == EditingMode.READ_WRITE_ONCE and not for_create:
            args.append("read_only=True")

        return f"{to_camel(self.name)} = {strip_path(self.django_serializer_class)}({", ".join(args)})"

    def include_in_create(self):
        return self.editing_mode != EditingMode.READ_ONLY

    def get_django_serializer_imports(self):
        imports = []
        if self.django_serializer_class is not None:
            imports.append(self.django_serializer_class)
        return imports

    # React

    def show_in_table(self):
        return False

    def to_table_lines(self, model_name):
        return "Not implemented!"
