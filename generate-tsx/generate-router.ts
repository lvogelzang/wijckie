import fs from "fs";
import { ClassMap, getClassMap } from "./utils/classMap";
import { extractRouterObjects } from "./utils/extractRouterObjects";
import { ModelClass, ModelDefinitions } from "./utils/modelDefinitions";
import { toCamel, toPascal } from "./utils/naming";
import { ExtractedRoute } from "./utils/routerTypes";
import { writeRouter } from "./utils/routerWriter";

const path = "/Users/lodewijckvogelzang/git/wijckie/front-end/src/Router.tsx";
const code = fs.readFileSync(path, "utf8");
const routeTree = extractRouterObjects(code);

const getSortingId = (route: ExtractedRoute): string => {
  const { path } = route;
  if (path.kind === "literal") {
    return path.value.toString();
  } else if (path.kind === "call" && path.callee === "makePath") {
    if (path.args.length > 0) {
      const firstArgs = path.args.at(0);
      if (firstArgs.kind === "member" && firstArgs.object === "l") {
        return firstArgs.property;
      }
    }
  }
  throw new Error(`Unsupported expression`);
};

const routes: Map<string, ExtractedRoute> = new Map();
for (const route of routeTree.at(0).children) {
  routes.set(getSortingId(route), route);
}

const addRoutes = (newRoutes: ExtractedRoute[]) => {
  for (const newRoute of newRoutes) {
    routes.set(getSortingId(newRoute), newRoute);
  }
};

const toRoutes = (
  classMap: ClassMap,
  moduleName: string,
  model: ModelClass
): ExtractedRoute[] => {
  const routes: ExtractedRoute[] = [];

  const classMapItem = classMap.get(toPascal(model.name));
  for (const mode of ["Create", "Update"]) {
    const urlName =
      mode === "Create" ? classMapItem.newName : classMapItem.idName;
    routes.push({
      path: {
        kind: "call",
        callee: "makePath",
        args: [
          {
            kind: "member",
            object: "l",
            property: urlName,
          },
        ],
      },
      element: {
        wrappers: [
          {
            component: {
              importPath: "@/auth/AuthenticatedRoute",
              exportName: "default",
              localName: "AuthenticatedRoute",
            },
            props: {},
          },
        ],
        page: {
          component: {
            importPath: `@/pages/modules/${toCamel(moduleName)}/${toPascal(
              model.name
            )}Page`,
            exportName: "default",
            localName: `${toPascal(model.name)}Page`,
          },
          props: { mode: { kind: "literal", value: mode } },
        },
      },
    });
  }
  return routes;
};

const directory = "/Users/lodewijckvogelzang/git/wijckie/generate/modules";
fs.readdirSync(directory).forEach((file) => {
  const moduleName = file.substring(0, file.indexOf("."));
  const moduleDefinition = fs.readFileSync(`${directory}/${file}`, "utf8");
  const content = JSON.parse(moduleDefinition) as ModelDefinitions;

  const classMap = getClassMap(moduleName, content);
  addRoutes(toRoutes(classMap, moduleName, content.module));
  for (const widget of content.widgets) {
    addRoutes(toRoutes(classMap, moduleName, widget));
  }
  for (const extraClass of content.extraClasses) {
    addRoutes(toRoutes(classMap, moduleName, extraClass));
  }
});

const sortedRoutes = Array.from(routes.values());
sortedRoutes.sort((a, b) => {
  return getSortingId(a).localeCompare(getSortingId(b));
});

routeTree.at(0).children = sortedRoutes;
const output = writeRouter(routeTree);
fs.writeFileSync(path, output);
