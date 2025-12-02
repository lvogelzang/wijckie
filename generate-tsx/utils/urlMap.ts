import { ModelDefinitions } from "./modelDefinitions";
import { stripPath, toCamel, toPascal, toUpperSnake } from "./naming";

export const getUrlMap = (
  moduleName: string,
  modelDefinitions: ModelDefinitions
) => {
  const map: Map<
    string,
    { idName: string; newName: string; parentArgs: string[] }
  > = new Map();
  map.set(toPascal(modelDefinitions.module.name), {
    idName: `MODULES__${toUpperSnake(moduleName)}__ID`,
    newName: `MODULES__${toUpperSnake(moduleName)}__NEW`,
    parentArgs: [],
  });
  for (const widget of modelDefinitions.widgets) {
    let parentFieldName: string;
    let parentUrlItem: {
      idName: string;
      newName: string;
      parentArgs: string[];
    };
    for (const field of widget.fields) {
      if (field.isParent) {
        parentFieldName = field.name;
        parentUrlItem = map.get(stripPath(field.to));
      }
    }
    map.set(toPascal(widget.name), {
      idName: `${parentUrlItem.idName}__${toUpperSnake(
        widget.shortPluralName
      )}__ID`,
      newName: `${parentUrlItem.idName}__${toUpperSnake(
        widget.shortPluralName
      )}__NEW`,
      parentArgs: [...parentUrlItem.parentArgs, toCamel(parentFieldName)],
    });
  }
  for (const extraClass of modelDefinitions.extraClasses) {
    let parentFieldName: string;
    let parentUrlItem: {
      idName: string;
      newName: string;
      parentArgs: string[];
    };
    for (const field of extraClass.fields) {
      if (field.isParent) {
        parentFieldName = field.name;
        parentUrlItem = map.get(stripPath(field.to));
      }
    }
    map.set(toPascal(extraClass.name), {
      idName: `${parentUrlItem.idName}__${toUpperSnake(
        extraClass.shortPluralName
      )}__ID`,
      newName: `${parentUrlItem.idName}__${toUpperSnake(
        extraClass.shortPluralName
      )}__NEW`,
      parentArgs: [...parentUrlItem.parentArgs, toCamel(parentFieldName)],
    });
  }
  return map;
};
