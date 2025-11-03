from generate.definitions.model_class import ModelClass


class ModelDefinitions:
    def __init__(self, module, widgets, extra_classes):
        self.module = module
        self.widgets = widgets
        self.extra_classes = extra_classes

    def from_dict(dict):
        return ModelDefinitions(
            module=ModelClass.from_dict(dict["module"]),
            widgets=list(map(lambda w: ModelClass.from_dict(w), dict["widgets"])),
            extra_classes=list(
                map(lambda c: ModelClass.from_dict(c), dict["extraClasses"])
            ),
        )

    def to_dict(self):
        return {
            "module": self.module.to_dict(),
            "widgets": list(map(lambda w: w.to_dict(), self.widgets)),
            "extraClasses": list(map(lambda c: c.to_dict(), self.extra_classes)),
        }

    def all_models(self):
        return [self.module] + self.widgets + self.extra_classes
