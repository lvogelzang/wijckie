from generate.utils.naming import get_path, strip_parenthesis, strip_path


class PythonImportMap:
    def __init__(self):
        self.map = {}

    def add_import(self, from_part, import_part):
        if from_part not in self.map:
            self.map[from_part] = set()
        self.map[from_part].add(import_part)

    def add_imports(self, from_part, imports_part):
        for import_part in imports_part:
            self.add_import(from_part, import_part)

    def add_imports_for_paths(self, imports):
        for imp in imports:
            self.add_import(get_path(imp), strip_parenthesis(strip_path(imp)))

    def to_python_lines(self, own_file_path):
        lines = []
        for key, value in self.map.items():
            if key == "":
                lines.append(f"import {value}")
            elif key == own_file_path:
                continue
            else:
                values = list(value)
                values.sort()
                lines.append(f"from {key} import {", ".join(values)}")
        lines.sort()
        return lines
