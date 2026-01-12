import { ClassMap } from "./classMap";
import { ModelClass } from "./modelDefinitions";
import { stripPath, toCamel, toPascal } from "./naming";

const getChildren = (classMap: ClassMap, item: ModelClass) => {
  const children: ModelClass[] = [];
  for (const classMapItem of classMap.values()) {
    for (const field of classMapItem.modelClass.fields) {
      if (field.to && stripPath(field.to) === toPascal(item.name)) {
        children.push(classMapItem.modelClass);
      }
    }
  }
  return children;
};

const getEndpointImports = (item: ModelClass, classMap: ClassMap) => {
  const endpoints = [`use${toPascal(item.pluralName)}Retrieve`];
  for (const field of item.fields) {
    if (field.to && field.name !== "user") {
      endpoints.push(
        `use${toPascal(
          classMap.get(stripPath(field.to)).modelClass.pluralName
        )}Retrieve`
      );
    }
  }
  return `import { ${endpoints.join(", ")} } from "@/api/endpoints/api"`;
};

const getChildTableImports = (
  item: ModelClass,
  classMap: ClassMap,
  moduleName: string
) => {
  const tableImports: string[] = [];
  for (const child of getChildren(classMap, item)) {
    tableImports.push(
      `import ${toPascal(child.name)}Table from "@/tables/modules/${toCamel(
        moduleName
      )}/${toPascal(child.name)}Table"`
    );
  }
  return tableImports;
};

const getImports = (
  item: ModelClass,
  classMap: ClassMap,
  moduleName: string
) => {
  const imports = [
    getEndpointImports(item, classMap),
    ...getChildTableImports(item, classMap, moduleName),
    'import Loader from "@/components/Loader"',
    'import { Page } from "@/components/Page"',
    `import ${toPascal(item.name)}Form from "@/forms/modules/${toCamel(
      moduleName
    )}/${toPascal(item.name)}Form"`,
    'import { useParams } from "react-router-dom"',
  ];
  return imports;
};

const getChildTables = (classMap: ClassMap, item: ModelClass) => {
  const childTables: string[] = [];
  for (const child of getChildren(classMap, item)) {
    childTables.push(
      `{mode === "Update" ? <${toPascal(
        child.name
      )}Table titleStyle="Section" ${toCamel(item.shortName)}={${toCamel(
        item.shortName
      )}!} /> : null}`
    );
  }
  return childTables;
};

const addParents = (
  parents: ModelClass[],
  classMap: ClassMap,
  item: ModelClass
) => {
  for (const field of item.fields) {
    if (field.isParent) {
      const parentItem = classMap.get(stripPath(field.to));
      if (!parents.includes(parentItem.modelClass)) {
        parents.push(parentItem.modelClass);
        addParents(parents, classMap, parentItem.modelClass);
      }
    }
  }
  return parents;
};

const getParents = (classMap: ClassMap, item: ModelClass) => {
  const parents: ModelClass[] = [];
  addParents(parents, classMap, item);
  return parents;
};

const getParentRetrievals = (classMap: ClassMap, item: ModelClass) => {
  const parentRetrievals: string[] = [];
  for (const parent of getParents(classMap, item)) {
    parentRetrievals.push(
      `const { data: ${toCamel(parent.shortName)} } = use${toPascal(
        parent.pluralName
      )}Retrieve(parseInt(${toCamel(parent.shortName)}Id!))`
    );
  }
  return parentRetrievals;
};

const getParams = (classMap: ClassMap, item: ModelClass) => {
  const params: string[] = [];
  for (const parent of getParents(classMap, item)) {
    params.push(`${toCamel(parent.shortName)}Id`);
  }
  params.push(`${toCamel(item.shortName)}Id`);
  return params;
};

const getLoaders = (classMap: ClassMap, item: ModelClass) => {
  let loadingCode = "";

  const parents = getParents(classMap, item);

  const parentConditions = parents.map((p) => `!${toCamel(p.shortName)}`);
  if (parentConditions.length > 0) {
    loadingCode += `    if (mode === "Create" && (${parentConditions.join(
      " || "
    )})) {
        return <Loader />
    } else `;
  } else {
    loadingCode += "    ";
  }

  const updateConditions = [
    `!${toCamel(item.shortName)}`,
    "isRefetching",
    ...parentConditions,
  ];
  loadingCode += `if (mode === "Update" && (${updateConditions.join(" || ")})) {
          return <Loader />
      }`;
  return loadingCode;
};

const getFormArgs = (classMap: ClassMap, item: ModelClass) => {
  const args: string[] = [];
  for (const parent of getParents(classMap, item)) {
    args.push(`${toCamel(parent.shortName)}={${toCamel(parent.shortName)}!}`);
  }
  args.push(`${toCamel(item.shortName)}={${toCamel(item.shortName)}}`);
  return args.join(" ");
};

export const writePage = (
  classMap: ClassMap,
  moduleName: string,
  item: ModelClass
) => {
  return `
${getImports(item, classMap, moduleName).join("\n")}

interface Props {
    mode: "Create" | "Update"
}

const ${toPascal(item.name)}Page = ({ mode }: Props) => {
    const { ${getParams(classMap, item).join(", ")} } = useParams()

${getParentRetrievals(classMap, item)}
    const { data: ${toCamel(item.shortName)}, isRefetching } = use${toPascal(
    item.pluralName
  )}Retrieve(parseInt(${toCamel(
    item.shortName
  )}Id!), { query: { enabled: mode === "Update" } })

${getLoaders(classMap, item)}

    return (
        <Page variant="configuration">
            <${toPascal(item.name)}Form mode={mode} ${getFormArgs(
    classMap,
    item
  )} />
${getChildTables(classMap, item).join("\n")}
        </Page>
    )
}

export default ${toPascal(item.name)}Page
`;
};
