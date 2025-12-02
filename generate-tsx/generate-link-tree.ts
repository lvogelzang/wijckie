import fs from "fs";
import { writeLinkTree } from "./utils/LinkTreeGeneration";
import { ExtractedConst, extractUrlObjects } from "./utils/extractLinkTree";
import { ModelDefinitions } from "./utils/modelDefinitions";
import { getUrlMap } from "./utils/urlMap";
import { toUrlObjects } from "./utils/urlObjects";

const path =
  "/Users/lodewijckvogelzang/git/wijckie/front-end/src/hooks/UseLinkTree.ts";
const code = fs.readFileSync(path, "utf8");
const urlObjects = extractUrlObjects(code);
const addUrlObjects = (newUrlObjects: ExtractedConst[]) => {
  for (const newUrlObject of newUrlObjects) {
    if (urlObjects.find((o) => o.name === newUrlObject.name) === undefined) {
      urlObjects.push(newUrlObject);
    }
  }
};

const directory = "/Users/lodewijckvogelzang/git/wijckie/generate/modules";
fs.readdirSync(directory).forEach((file) => {
  const moduleName = file.substring(0, file.indexOf("."));
  const moduleDefinition = fs.readFileSync(`${directory}/${file}`, "utf8");
  const content = JSON.parse(moduleDefinition) as ModelDefinitions;

  const urlMap = getUrlMap(moduleName, content);
  addUrlObjects(toUrlObjects(urlMap, moduleName, content.module));
  for (const widget of content.widgets) {
    addUrlObjects(toUrlObjects(urlMap, moduleName, widget));
  }
  for (const extraClass of content.extraClasses) {
    addUrlObjects(toUrlObjects(urlMap, moduleName, extraClass));
  }
});

urlObjects.sort((a, b) => a.name.localeCompare(b.name));
const output = writeLinkTree(urlObjects);
fs.writeFileSync(path, output);
