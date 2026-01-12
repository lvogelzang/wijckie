import { ModelClass, ModelField } from "./modelDefinitions";
import { toPascal, toSnake } from "./naming";

const getFieldTranslationKey = (item: ModelClass, field: ModelField) => {
  if (field.type === "order") {
    return "Main.order";
  }
  return `${toPascal(item.name)}.${toSnake(field.name)}`;
};

export { getFieldTranslationKey };
