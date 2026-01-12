import generate from "@babel/generator";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import {
  ComponentRef,
  ExpressionValue,
  ExtractedRoute,
  PageComponent,
  RouteElement,
  WrapperComponent,
} from "./routerTypes";

function codeOf(node: any): string {
  return generate(node, { retainLines: false }).code;
}

function extractExpression(node: t.Expression): ExpressionValue {
  if (t.isIdentifier(node)) {
    return { kind: "identifier", name: node.name };
  }

  if (
    t.isMemberExpression(node) &&
    t.isIdentifier(node.object) &&
    t.isIdentifier(node.property)
  ) {
    return {
      kind: "member",
      object: node.object.name,
      property: node.property.name,
    };
  }

  if (t.isCallExpression(node) && t.isIdentifier(node.callee)) {
    return {
      kind: "call",
      callee: node.callee.name,
      args: node.arguments.map((arg) => extractExpression(arg as t.Expression)),
    };
  }

  if (
    t.isStringLiteral(node) ||
    t.isNumericLiteral(node) ||
    t.isBooleanLiteral(node)
  ) {
    return { kind: "literal", value: node.value };
  }

  throw new Error(`Unsupported expression: ${node.type}`);
}

function extractJsxProps(
  attrs: (t.JSXAttribute | t.JSXSpreadAttribute)[]
): Record<string, ExpressionValue> {
  const props: Record<string, ExpressionValue> = {};

  for (const attr of attrs) {
    if (!t.isJSXAttribute(attr)) {
      throw new Error("JSX spread not supported");
    }

    const key = attr.name.name;

    if (typeof key !== "string") {
      throw new Error("JSXIdentifier not supported");
    }

    if (!attr.value) {
      props[key] = { kind: "literal", value: true };
      continue;
    }

    if (t.isStringLiteral(attr.value)) {
      props[key] = { kind: "literal", value: attr.value.value };
      continue;
    }

    if (t.isJSXExpressionContainer(attr.value)) {
      if (t.isExpression) {
        props[key] = extractExpression(attr.value.expression as t.Expression);
        continue;
      } else {
        throw new Error("JSXEmptyExpression not supported");
      }
    }
  }

  return props;
}

function extractPageComponent(
  node: t.JSXElement,
  importMap: ImportMap
): PageComponent {
  const nameNode = node.openingElement.name;

  if (!t.isJSXIdentifier(nameNode)) {
    throw new Error("Unsupported JSX element name");
  }

  const ref = importMap.get(nameNode.name);

  if (!ref) {
    throw new Error(`Unresolved component import: ${nameNode.name}`);
  }

  return {
    component: ref,
    props: extractJsxProps(node.openingElement.attributes),
  };
}

function extractWrapperComponent(
  node: t.JSXElement,
  importMap: ImportMap
): WrapperComponent {
  const nameNode = node.openingElement.name;

  if (!t.isJSXIdentifier(nameNode)) {
    throw new Error("Unsupported wrapper");
  }

  const ref = importMap.get(nameNode.name);

  if (!ref) {
    throw new Error(`Unresolved wrapper import: ${nameNode.name}`);
  }

  return {
    component: ref,
    props: extractJsxProps(node.openingElement.attributes),
  };
}

function isWrapperComponent(ref: ComponentRef): boolean {
  return (
    ref.importPath === "@/auth/AuthenticatedRoute" ||
    ref.importPath === "@/auth/AnonymousRoute"
  );
}

function extractRouteElement(
  node: t.Expression,
  importMap: ImportMap
): RouteElement {
  if (!t.isJSXElement(node)) {
    throw new Error("Expected JSXElement for route element");
  }

  const wrappers: WrapperComponent[] = [];
  let current = node;

  while (true) {
    const opening = current.openingElement;
    const nameNode = opening.name;

    if (!t.isJSXIdentifier(nameNode)) break;

    const componentRef = importMap.get(nameNode.name);

    if (!componentRef || !isWrapperComponent(componentRef)) {
      break;
    }

    wrappers.push(extractWrapperComponent(current, importMap));

    const children = current.children.filter(t.isJSXElement);
    if (children.length !== 1) {
      throw new Error(`${nameNode.name} must wrap exactly one JSX element`);
    }

    current = children[0];
  }

  return {
    wrappers,
    page: extractPageComponent(current, importMap),
  };
}

function extractRouteObject(
  node: t.ObjectExpression,
  importMap: ImportMap
): ExtractedRoute {
  const route: ExtractedRoute = {};

  for (const prop of node.properties) {
    if (!t.isObjectProperty(prop) || !t.isIdentifier(prop.key)) continue;

    const key = prop.key.name;
    const value = prop.value;

    switch (key) {
      case "path":
        route.path = extractExpression(value as t.Expression);
        break;

      case "index":
        route.index = t.isBooleanLiteral(value) ? value.value : undefined;
        break;

      case "element":
        route.element = extractRouteElement(value as t.Expression, importMap);
        break;

      case "loader":
        if (t.isIdentifier(value)) {
          route.loader = {
            kind: "identifier",
            name: value.name,
          };
        }
        break;

      case "children":
        if (t.isArrayExpression(value)) {
          route.children = value.elements
            .filter(t.isObjectExpression)
            .map((node) => extractRouteObject(node, importMap));
        }
        break;
    }
  }

  return route;
}

type ImportMap = Map<string, ComponentRef>;

function collectImportMap(ast: t.File): ImportMap {
  const imports = new Map<string, ComponentRef>();

  traverse(ast, {
    ImportDeclaration(path) {
      const importPath = path.node.source.value;
      for (const specifier of path.node.specifiers) {
        if (t.isImportDefaultSpecifier(specifier)) {
          imports.set(specifier.local.name, {
            importPath,
            exportName: "default",
            localName: specifier.local.name,
          });
        } else if (t.isImportSpecifier(specifier)) {
          if (t.isStringLiteral(specifier.imported)) {
            imports.set(specifier.local.name, {
              importPath,
              exportName: specifier.imported.value,
              localName: specifier.local.name,
            });
          } else {
            imports.set(specifier.local.name, {
              importPath,
              exportName: specifier.imported.name,
              localName: specifier.local.name,
            });
          }
        }
      }
    },
  });

  return imports;
}

function extractRoutes(ast: t.File, importMap: ImportMap): ExtractedRoute[] {
  let routes: ExtractedRoute[] = [];

  traverse(ast, {
    CallExpression(path) {
      if (t.isIdentifier(path.node.callee, { name: "createBrowserRouter" })) {
        const arg = path.node.arguments[0];
        if (t.isArrayExpression(arg)) {
          routes = arg.elements
            .filter(t.isObjectExpression)
            .map((node) => extractRouteObject(node, importMap));
        }
      }
    },
  });

  return routes;
}

export function extractRouterObjects(code: string) {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  const importMap = collectImportMap(ast);
  return extractRoutes(ast, importMap);
}
