import { ModelClass, ModelDefinitions } from "./modelDefinitions";
import { stripPath, toCamel, toPascal, toUpperSnake } from "./naming";

export interface ClassMapItem {
  idName: string;
  newName: string;
  parentArgs: string[];
  modelClass: ModelClass;
}

export type ClassMap = Map<string, ClassMapItem>;

export const getClassMap = (
  moduleName: string,
  modelDefinitions: ModelDefinitions
) => {
  const map: ClassMap = new Map();
  map.set(toPascal(modelDefinitions.module.name), {
    idName: `MODULES__${toUpperSnake(moduleName)}__ID`,
    newName: `MODULES__${toUpperSnake(moduleName)}__NEW`,
    parentArgs: [],
    modelClass: modelDefinitions.module,
  });
  for (const widget of modelDefinitions.widgets) {
    let parentFieldName: string;
    let parentUrlItem: ClassMapItem;
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
      modelClass: widget,
    });
  }
  for (const extraClass of modelDefinitions.extraClasses) {
    let parentFieldName: string;
    let parentUrlItem: ClassMapItem;
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
      modelClass: extraClass,
    });
  }
  return map;
};
