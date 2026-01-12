import { ClassMap } from "./classMap";
import { ExtractedConst } from "./extractLinkTree";
import { ModelClass } from "./modelDefinitions";
import {
  strip_module_name,
  stripPath,
  toCamel,
  toKebab,
  toPascal,
  toUpperSnake,
} from "./naming";

export const toUrlObjects = (
  classMap: ClassMap,
  moduleName: string,
  input: ModelClass
) => {
  const parentField = input.fields.find((f) => !!f.isParent);
  return !parentField
    ? toModuleUrlObjects(moduleName, input)
    : toChildUrlObjects(
        classMap,
        moduleName,
        input,
        stripPath(parentField.to!)
      );
};

const toChildUrlObjects = (
  classMap: ClassMap,
  moduleName: string,
  input: ModelClass,
  parentClass: string
) => {
  const upperSnakePluralName = toUpperSnake(
    strip_module_name(moduleName, input.pluralName)
  );
  const pascalModelName = toPascal(input.name);

  return [
    {
      name: `${classMap.get(parentClass)!.idName}__${upperSnakePluralName}`,
      tsType: "StaticUrlItem",
      fields: {
        slug: toKebab(strip_module_name(moduleName, input.pluralName)),
        parent: classMap.get(parentClass)!.idName,
        title: `t("${pascalModelName}.plural_name")`,
        hasPage: false,
      },
    },
    {
      name: `${
        classMap.get(parentClass)!.idName
      }__${upperSnakePluralName}__NEW`,
      tsType: "StaticUrlItem",
      fields: {
        slug: "new",
        parent: `${classMap.get(parentClass)!.idName}__${upperSnakePluralName}`,
        title: 't("Breadcrumbs.new")',
        hasPage: true,
      },
    },
    {
      name: `${classMap.get(parentClass)!.idName}__${upperSnakePluralName}__ID`,
      tsType: "VariableUrlItem",
      fields: {
        variable: `${toCamel(input.name)}Id`,
        parent: `${classMap.get(parentClass)!.idName}__${upperSnakePluralName}`,
        toTitle: {
          params: ["item"],
          body: `(item as ${pascalModelName})?.name ?? ""`,
          usesModel: { [pascalModelName]: "@/api/models/api" },
        },
        hrefPart: {
          params: ["item"],
          body: `(item as ${pascalModelName})?.id ?? ""`,
          usesModel: { [pascalModelName]: "@/api/models/api" },
        },
        hasPage: true,
      },
    },
  ] as ExtractedConst[];
};

const toModuleUrlObjects = (moduleName: string, input: ModelClass) => {
  const upperSnakeModuleName = toUpperSnake(moduleName);
  const pascalModelName = toPascal(input.name);
  return [
    {
      name: `MODULES__${upperSnakeModuleName}`,
      tsType: "StaticUrlItem",
      fields: {
        slug: toKebab(moduleName),
        parent: "MODULES",
        title: `t("${pascalModelName}.plural_name")`,
        hasPage: false,
      },
    },
    {
      name: `MODULES__${upperSnakeModuleName}__NEW`,
      tsType: "StaticUrlItem",
      fields: {
        slug: "new",
        parent: `MODULES__${upperSnakeModuleName}`,
        title: 't("Breadcrumbs.new")',
        hasPage: true,
      },
    },
    {
      name: `MODULES__${upperSnakeModuleName}__ID`,
      tsType: "VariableUrlItem",
      fields: {
        variable: "moduleId",
        parent: `MODULES__${upperSnakeModuleName}`,
        toTitle: {
          params: ["item"],
          body: `(item as ${pascalModelName})?.name ?? ""`,
          usesModel: { [pascalModelName]: "@/api/models/api" },
        },
        hrefPart: {
          params: ["item"],
          body: `(item as ${pascalModelName})?.id ?? ""`,
          usesModel: { [pascalModelName]: "@/api/models/api" },
        },

        hasPage: true,
      },
    },
  ] as ExtractedConst[];
};
