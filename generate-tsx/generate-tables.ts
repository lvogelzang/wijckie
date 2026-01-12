import fs from "fs";
import { getClassMap } from "./utils/classMap";
import { getModels, ModelDefinitions } from "./utils/modelDefinitions";
import { toCamel, toPascal } from "./utils/naming";
import { writeTable } from "./utils/tableGeneration";

const tablesDirectory = `/Users/lodewijckvogelzang/git/wijckie/front-end/src/tables/modules`;
const directory = "/Users/lodewijckvogelzang/git/wijckie/generate/modules";
fs.readdirSync(directory).forEach((file) => {
  const moduleName = file.substring(0, file.indexOf("."));
  const moduleDefinition = fs.readFileSync(`${directory}/${file}`, "utf8");
  const content = JSON.parse(moduleDefinition) as ModelDefinitions;

  const classMap = getClassMap(moduleName, content);

  const moduleTablesDirectory = `${tablesDirectory}/${toCamel(moduleName)}`;
  if (!fs.existsSync(moduleTablesDirectory)) {
    fs.mkdirSync(moduleTablesDirectory);
  }
  for (const model of getModels(content)) {
    const output = writeTable(classMap, model);
    const path = `${moduleTablesDirectory}/${toPascal(model.name)}Table.tsx`;
    fs.writeFileSync(path, output);
  }
});
