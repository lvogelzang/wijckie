import generate from "@babel/generator";
import * as t from "@babel/types";
import {
  buildImportDeclarations,
  getImportMap,
  groupImports,
} from "./importMap";
import {
  ComponentRef,
  ExpressionValue,
  ExtractedRoute,
  PageComponent,
  RouteElement,
  WrapperComponent,
} from "./routerTypes";

function buildRouteObject(route: ExtractedRoute): t.ObjectExpression {
  const props: t.ObjectProperty[] = [];

  if (route.path) {
    props.push(
      t.objectProperty(t.identifier("path"), buildExpression(route.path))
    );
  }

  if (route.index) {
    props.push(t.objectProperty(t.identifier("index"), t.booleanLiteral(true)));
  }

  if (route.element) {
    props.push(
      t.objectProperty(
        t.identifier("element"),
        buildRouteElement(route.element)
      )
    );
  }

  if (route.loader) {
    props.push(
      t.objectProperty(t.identifier("loader"), t.identifier(route.loader.name))
    );
  }

  if (route.children?.length) {
    props.push(
      t.objectProperty(
        t.identifier("children"),
        t.arrayExpression(route.children.map(buildRouteObject))
      )
    );
  }

  return t.objectExpression(props);
}

function buildRouteElement(element: RouteElement): t.JSXElement {
  let jsx = buildPageElement(element.page);

  for (const wrapper of element.wrappers.reverse()) {
    jsx = buildWrapperElement(wrapper, jsx);
  }

  return jsx;
}

function buildPageElement(page: PageComponent): t.JSXElement {
  const name = t.jsxIdentifier(page.component.localName);

  return t.jsxElement(
    t.jsxOpeningElement(name, buildJsxAttributes(page.props), true),
    null,
    [],
    true
  );
}

function buildWrapperElement(
  wrapper: WrapperComponent,
  child: t.JSXElement
): t.JSXElement {
  const name = t.jsxIdentifier(wrapper.component.localName);

  return t.jsxElement(
    t.jsxOpeningElement(name, buildJsxAttributes(wrapper.props), false),
    t.jsxClosingElement(name),
    [t.jsxText("\n"), child, t.jsxText("\n")],
    false
  );
}

function buildJsxAttributes(
  props: Record<string, ExpressionValue>
): t.JSXAttribute[] {
  return Object.entries(props).map(([key, value]) =>
    t.jsxAttribute(t.jsxIdentifier(key), buildJsxAttributeValue(value))
  );
}

function buildJsxAttributeValue(
  value: ExpressionValue
): t.JSXAttribute["value"] {
  if (value.kind === "literal") {
    return typeof value.value === "string"
      ? t.stringLiteral(value.value)
      : t.jsxExpressionContainer(t.valueToNode(value.value));
  }

  return t.jsxExpressionContainer(buildExpression(value));
}

function buildExpression(value: ExpressionValue): t.Expression {
  switch (value.kind) {
    case "identifier":
      return t.identifier(value.name);
    case "literal":
      return t.valueToNode(value.value);
    case "member":
      return t.memberExpression(
        t.identifier(value.object),
        t.identifier(value.property)
      );
    case "call":
      return t.callExpression(
        t.identifier(value.callee),
        value.args.map(buildExpression)
      );

    default:
      throw new Error("Unsupported expression");
  }
}

function buildRouter(routes: ExtractedRoute[]): t.Expression {
  return t.callExpression(t.identifier("createBrowserRouter"), [
    t.arrayExpression(routes.map(buildRouteObject)),
  ]);
}

function buildProgram(routes: ExtractedRoute[]): t.File {
  //   const routerDeclaration = t.variableDeclaration("const", [
  //     t.variableDeclarator(t.identifier("createRouter"), buildRouter(routes)),
  //   ]);

  const a = t.returnStatement(buildRouter(routes));

  return t.file(t.program([a]));
}

export function writeRouter(routes: ExtractedRoute[]) {
  const routeImportDeclarations = getImportMap(routes);

  const componentRefs: ComponentRef[] = [
    {
      importPath: "@/auth/AuthContext",
      exportName: "AuthContext",
      localName: "AuthContext",
    },
    {
      importPath: "@/hooks/UseLinkTree",
      exportName: "default",
      localName: "useLinkTree",
    },
    {
      importPath: "react",
      exportName: "useContext",
      localName: "useContext",
    },
    {
      importPath: "react",
      exportName: "useEffect",
      localName: "useEffect",
    },
    {
      importPath: "react",
      exportName: "useState",
      localName: "useState",
    },
    {
      importPath: "react-router-dom",
      exportName: "createBrowserRouter",
      localName: "createBrowserRouter",
    },
    {
      importPath: "react-router-dom",
      exportName: "RouterProvider",
      localName: "RouterProvider",
    },
    {
      importPath: "@/helpers/LinkTreeHelper",
      exportName: "makePath",
      localName: "makePath",
    },
    {
      importPath: "@/auth/allauth",
      exportName: "AuthenticatorTypes",
      localName: "AuthenticatorTypes",
    },
    {
      importPath: "@/auth/allauth",
      exportName: "Flows",
      localName: "Flows",
    },
    {
      importPath: "@/loaders/listAuthenticators",
      exportName: "listAuthenticators",
      localName: "listAuthenticators",
    },
  ];
  const importGroups = groupImports(componentRefs);
  const extraImportDeclarations = buildImportDeclarations(importGroups);

  const importsProgram = t.file(
    t.program([...routeImportDeclarations, ...extraImportDeclarations])
  );

  const importsCode = generate(importsProgram, {
    retainLines: false,
    jsescOption: { minimal: true },
  }).code;

  const ast = buildProgram(routes);
  const createRouterCode = generate(ast, {
    retainLines: false,
    jsescOption: { minimal: true },
  }).code;

  return `${importsCode}

const createRouter = (l: ReturnType<typeof useLinkTree>) => {
${createRouterCode}
}

const Router = () => {
    // If we create the router globally, the loaders of the routes already trigger
    // even before the <AuthContext/> trigger the initial loading of the auth state.
    const [router, setRouter] = useState<ReturnType<typeof createBrowserRouter>>()
    const authContext = useContext(AuthContext)
    const l = useLinkTree()

    useEffect(() => {
        if (authContext) {
            setRouter(createRouter(l))
        }
    }, [authContext])

    return router ? <RouterProvider router={router} /> : null
}

export default Router`;
}
