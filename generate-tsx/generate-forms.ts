import fs from "fs";
import { writeForm } from "./utils/formGeneration";
import { getModels, ModelDefinitions } from "./utils/modelDefinitions";
import { toCamel, toPascal } from "./utils/naming";
import { getUrlMap } from "./utils/urlMap";

const formsDirectory = `/Users/lodewijckvogelzang/git/wijckie/front-end/src/forms/modules`;
const directory = "/Users/lodewijckvogelzang/git/wijckie/generate/modules";
fs.readdirSync(directory).forEach((file) => {
  const moduleName = file.substring(0, file.indexOf("."));
  const moduleDefinition = fs.readFileSync(`${directory}/${file}`, "utf8");
  const content = JSON.parse(moduleDefinition) as ModelDefinitions;

  const urlMap = getUrlMap(moduleName, content);

  const moduleFormsDirectory = `${formsDirectory}/${toCamel(moduleName)}`;
  if (!fs.existsSync(moduleFormsDirectory)) {
    fs.mkdirSync(moduleFormsDirectory);
  }
  for (const model of getModels(content)) {
    const output = writeForm(urlMap, moduleName, model);
    const path = `${moduleFormsDirectory}/${toPascal(model.name)}Form.tsx`;
    fs.writeFileSync(path, output);
  }
});
