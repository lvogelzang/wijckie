import fs from "fs";
import { getClassMap } from "./utils/classMap";
import { getModels, ModelDefinitions } from "./utils/modelDefinitions";
import { toCamel, toPascal } from "./utils/naming";
import { writePage } from "./utils/pageGeneration";

const pagesDirectory = `/Users/lodewijckvogelzang/git/wijckie/front-end/src/pages/modules`;
const directory = "/Users/lodewijckvogelzang/git/wijckie/generate/modules";
fs.readdirSync(directory).forEach((file) => {
  const moduleName = file.substring(0, file.indexOf("."));
  const moduleDefinition = fs.readFileSync(`${directory}/${file}`, "utf8");
  const content = JSON.parse(moduleDefinition) as ModelDefinitions;

  const classMap = getClassMap(moduleName, content);

  const modulePagesDirectory = `${pagesDirectory}/${toCamel(moduleName)}`;
  if (!fs.existsSync(modulePagesDirectory)) {
    fs.mkdirSync(modulePagesDirectory);
  }
  for (const model of getModels(content)) {
    const output = writePage(classMap, moduleName, model);
    const path = `${modulePagesDirectory}/${toPascal(model.name)}Page.tsx`;
    fs.writeFileSync(path, output);
  }
});
