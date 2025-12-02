# from generate.utils.naming import get_path, strip_parenthesis, strip_path


class TypescriptImportMap:
    def __init__(self):
        self.map = {}

    def add_import(self, import_part, from_part, is_type=False, is_nested=False):
        if from_part not in self.map:
            self.map[from_part] = set()
        self.map[from_part].add((import_part, is_type, is_nested))

    def to_typescript_lines(self):
        lines = []
        for key, values in self.map.items():
            line = "import "

            unnested_parts = list(filter(lambda f: f[2] is False, values))
            if len(unnested_parts) > 0:
                parts = []
                for part in unnested_parts:
                    if part[1] == True:
                        parts.append(f"type {part[0]}")
                    else:
                        parts.append(part[0])
                line += f"{", ".join(parts)}"

            nested_parts = list(filter(lambda f: f[2] is True, values))
            if len(nested_parts) > 0:
                parts = []
                for part in nested_parts:
                    if part[1] == True:
                        parts.append(f"type {part[0]}")
                    else:
                        parts.append(part[0])
                if len(unnested_parts) > 0:
                    line += ", "
                line += f"{{ {", ".join(parts)} }}"

            line += f' from "{key}"'
            lines.append(line)

        return lines
