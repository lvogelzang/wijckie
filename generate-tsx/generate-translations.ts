import fs from "fs";
import { getModels, ModelDefinitions } from "./utils/modelDefinitions";
import { toPascal, toSnake } from "./utils/naming";

const locales = ["nl", "en_GB"];
const localesDirectory = `/Users/lodewijckvogelzang/git/wijckie/front-end/src/locales`;
const directory = "/Users/lodewijckvogelzang/git/wijckie/generate/modules";
fs.readdirSync(directory).forEach((file) => {
  const moduleDefinition = fs.readFileSync(`${directory}/${file}`, "utf8");
  const content = JSON.parse(moduleDefinition) as ModelDefinitions;

  for (const model of getModels(content)) {
    for (const locale of locales) {
      const localeDirectory = locale.replace("_", "-");
      const localeFilePath = `${localesDirectory}/${localeDirectory}/translation.json`;
      const localeContent = JSON.parse(fs.readFileSync(localeFilePath, "utf8"));

      const modelValues = model.translations[locale];
      if (modelValues && typeof modelValues === "object") {
        for (const key in modelValues) {
          localeContent[toPascal(model.name)][toSnake(key)] = modelValues[key];
        }
      }
      for (const field of model.fields) {
        if (field.translations) {
          const fieldValues = field.translations[locale];
          if (fieldValues && typeof fieldValues === "object") {
            for (const key in fieldValues) {
              localeContent[toPascal(model.name)][toSnake(field.name)] =
                fieldValues[key];
            }
          }
        }
      }

      fs.writeFileSync(localeFilePath, JSON.stringify(localeContent, null, 2));
    }
  }
});
