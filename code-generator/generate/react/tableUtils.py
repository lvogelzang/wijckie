from generate.utils.naming import to_camel, to_pascal, to_snake


def to_table_lines(model_name, field_name, is_object_link_in_table):
    if is_object_link_in_table:
        cell_function = f"""({{ row }}) => (
                    <Link to={{`/modules/inspiration/${{row.original.id}}`}} data-cy="{to_camel(model_name)}Link">
                        {{row.original.{to_camel(field_name)}}}
                    </Link>
                )"""
    else:
        cell_function = f"""({{ row }}) => (
                    <div>{{row.original.{to_camel(field_name)}}}</div>
                )"""

    return f"""{{
                id: "{to_camel(field_name)}",
                header: t("{to_pascal(model_name)}.{to_snake(field_name)}"),
                cell: {cell_function},
            }},"""
