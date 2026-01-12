import * as t from "@babel/types";
import { ComponentRef, ExtractedRoute } from "./routerTypes";

function collectComponentRefs(routes: ExtractedRoute[]): ComponentRef[] {
  const refs: Set<ComponentRef> = new Set();

  function visit(route: ExtractedRoute) {
    if (route.element) {
      for (const w of route.element.wrappers) {
        refs.add(w.component);
      }
      refs.add(route.element.page.component);
    }

    route.children?.forEach(visit);
  }

  routes.forEach(visit);

  return Array.from(refs);
}

type ImportGroup = {
  default?: ComponentRef;
  named: ComponentRef[];
};

export function groupImports(refs: ComponentRef[]): Map<string, ImportGroup> {
  const map = new Map<string, ImportGroup>();

  for (const ref of refs) {
    let group = map.get(ref.importPath);
    if (!group) {
      group = { named: [] };
      map.set(ref.importPath, group);
    }

    if (ref.exportName === "default") {
      group.default = ref;
    } else {
      group.named.push(ref);
    }
  }

  return map;
}

export function buildImportDeclarations(
  groups: Map<string, ImportGroup>
): t.ImportDeclaration[] {
  const imports: t.ImportDeclaration[] = [];

  for (const [importPath, group] of groups) {
    const specifiers: (t.ImportSpecifier | t.ImportDefaultSpecifier)[] = [];

    if (group.default) {
      specifiers.push(
        t.importDefaultSpecifier(t.identifier(group.default.localName))
      );
    }

    for (const ref of group.named) {
      specifiers.push(
        t.importSpecifier(
          t.identifier(ref.localName),
          t.identifier(ref.exportName)
        )
      );
    }

    imports.push(t.importDeclaration(specifiers, t.stringLiteral(importPath)));
  }

  return imports;
}

export function getImportMap(routes: ExtractedRoute[]) {
  const componentRefs = collectComponentRefs(routes);
  const importGroups = groupImports(componentRefs);
  return buildImportDeclarations(importGroups);
}
