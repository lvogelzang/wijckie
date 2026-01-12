import { ClassMap } from "./classMap";
import { ModelClass } from "./modelDefinitions";
import { stripPath, toCamel, toPascal } from "./naming";
import { getFieldTranslationKey } from "./translationUtils";

const getTypeImports = (item: ModelClass) => {
  const classes = [toPascal(item.name)];
  for (const field of item.fields) {
    if (field.to) {
      if (field.inTable || field.isParent) {
        classes.push(stripPath(field.to));
      }
    }
  }
  return `import type { ${classes.join(", ")} } from "@/api/models/api"`;
};

const getProps = (item: ModelClass) => {
  const props = ["    titleStyle: TitleStyle"];
  for (const field of item.fields) {
    if (field.isParent) {
      props.push(`    ${toCamel(field.name)}: ${stripPath(field.to)}`);
    }
  }
  return props;
};

const getPropList = (item: ModelClass) => {
  const propList = ["titleStyle"];
  for (const field of item.fields) {
    if (field.isParent) {
      propList.push(toCamel(field.name));
    }
  }
  return propList;
};

const getQueryArgs = (item: ModelClass) => {
  const args = [];
  for (const field of item.fields) {
    if (field.isParent) {
      args.push(`${toCamel(field.name)}: ${toCamel(field.name)}.id`);
    }
  }
  return args;
};

const getColumns = (classMap: ClassMap, item: ModelClass) => {
  const columns = [];
  for (const field of item.fields) {
    if (field.inTable) {
      if (field.isObjectLinkInTable) {
        const urlItem = classMap.get(toPascal(item.name));
        columns.push(`            {
                id: "${toCamel(field.name)}",
                header: t("${getFieldTranslationKey(item, field)}"),
                cell: ({ row }) => (
                    <Link to={makeUrl(l.${urlItem.idName}, [${[
          ...urlItem.parentArgs,
          "row.original",
        ].join(", ")}])} data-cy="${toCamel(item.name)}Link">
                        {row.original.${toCamel(field.name)}}
                    </Link>
                ),
            }`);
      } else {
        columns.push(`{
                id: "${toCamel(field.name)}",
                header: t("${getFieldTranslationKey(item, field)}"),
                cell: ({ row }) => <div>{row.original.${toCamel(
                  field.name
                )}}</div>,
            }`);
      }
    }
  }
  return columns;
};

const getColumnDeps = (item: ModelClass) => {
  const deps = ["t", "l"];
  for (const field of item.fields) {
    if (field.to) {
      if (field.inTable || field.isParent) {
        deps.push(toCamel(field.name));
      }
    }
  }
  return deps;
};

const getButtonDependencies = (item: ModelClass) => {
  const deps = ["t", "l"];
  for (const field of item.fields) {
    if (field.to) {
      if (field.inTable || field.isParent) {
        deps.push(toCamel(field.name));
      }
    }
  }
  return deps;
};

export const writeTable = (classMap: ClassMap, item: ModelClass) => {
  const IMPORTS = [
    `import { use${toPascal(item.pluralName)}List } from "@/api/endpoints/api"`,
    getTypeImports(item),
    'import Table from "@/components/table/Table"',
    'import type { TableButtonDef } from "@/components/table/TableButtonDef"',
    'import { makeUrl } from "@/helpers/LinkTreeHelper"',
    'import useLinkTree from "@/hooks/UseLinkTree"',
    'import type { TitleStyle } from "@/types/TitleStyle"',
    'import type { ColumnDef } from "@tanstack/react-table"',
    'import { useMemo } from "react"',
    'import { useTranslation } from "react-i18next"',
    'import { Link } from "react-router-dom"',
  ];

  const PROPS = getProps(item);
  const PROP_LIST = getPropList(item).join(", ");
  const QUERY_ARGS = getQueryArgs(item).join(", ");

  return `
${IMPORTS.join("\n")}

interface Props {
${PROPS.join("\n")}
}

const ${toPascal(item.name)}Table = ({ ${PROP_LIST} }: Props) => {
    const { t } = useTranslation()
    const l = useLinkTree()
    const dataQuery = use${toPascal(item.pluralName)}List({${QUERY_ARGS}})

    const columns = useMemo((): ColumnDef<${toPascal(item.name)}>[] => {
        return [
            ${getColumns(classMap, item)}
        ]
    }, [${getColumnDeps(item).join(", ")}])

    const buttons = useMemo((): TableButtonDef[] => {
        return [
            {
                id: "new${toPascal(item.name)}",
                label: t("Main.new"),
                link: makeUrl(l.${
                  classMap.get(toPascal(item.name)).newName
                }, [${classMap
    .get(toPascal(item.name))
    .parentArgs.join(", ")}]),
            },
        ]
    }, [${getButtonDependencies(item).join(", ")}])

    return (
        <Table
            id="${toPascal(item.pluralName)}Table"
            title={t("${toPascal(item.name)}.plural_name")}
            titleStyle={titleStyle}
            columns={columns}
            buttons={buttons}
            subject={t("${toPascal(item.name)}.plural_name")}
            dataQuery={dataQuery}
        />
    )
}

export default ${toPascal(item.name)}Table
  `;
};
