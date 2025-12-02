def find_nodes_by_type(ast, target_types):
    results = []

    def _search(node):
        if isinstance(node, dict):
            if node.get("type") in target_types:
                results.append(node)
            for value in node.values():
                _search(value)
        elif isinstance(node, list):
            for item in node:
                _search(item)

    _search(ast)
    return results


def extract_const_objects_from_ast(ast):
    """Extracts const NAME: Type = { ... } anywhere inside the file,
    even when wrapped in useMemo(() => { ... })."""

    items = []

    def walk(node):
        # recursively walk entire AST
        if isinstance(node, dict):
            # Detect: const NAME: Type = { ... }
            if (
                node.get("type") == "VariableDeclaration"
                and node.get("kind") == "const"
            ):
                for decl in node.get("declarations", []):
                    id_ = decl.get("id")
                    init = decl.get("init")

                    # has TS type annotation?
                    if not id_ or not id_.get("typeAnnotation"):
                        continue

                    # must be an object literal
                    if not init or init.get("type") != "ObjectExpression":
                        continue

                    name = id_["name"]

                    # extract type name
                    type_ann = id_["typeAnnotation"]["typeAnnotation"]
                    ts_type = None

                    # handles: StaticUrlItem and VariableUrlItem
                    if type_ann.get("type") == "TSTypeReference":
                        ts_type = type_ann["typeName"]["name"]

                    # extract object fields
                    fields = {}
                    for prop in init.get("properties", []):
                        key = prop["key"]["name"]
                        value_node = prop["value"]

                        # Basic literal extraction (extendable)
                        if value_node["type"] == "StringLiteral":
                            value = value_node["value"]
                        elif value_node["type"] == "BooleanLiteral":
                            value = value_node["value"]
                        elif value_node["type"] == "Identifier":
                            value = value_node["name"]
                        else:
                            # function, typecast, arrow, etc.
                            value = "<complex>"

                        fields[key] = value

                    items.append({"name": name, "type": ts_type, **fields})

            # Recurse into child properties
            for v in node.values():
                walk(v)

        elif isinstance(node, list):
            for v in node:
                walk(v)

    walk(ast)
    return items
