export interface ComponentRef {
  importPath: string;
  exportName: string; // "default" or actual export name
  localName: string;
}

export interface RouteElement {
  wrappers: WrapperComponent[];
  page: PageComponent;
}

export interface WrapperComponent {
  component: ComponentRef;
  props: Record<string, ExpressionValue>;
}

export interface PageComponent {
  component: ComponentRef;
  props: Record<string, ExpressionValue>;
}

export type ExpressionValue =
  | { kind: "identifier"; name: string }
  | { kind: "member"; object: string; property: string }
  | { kind: "call"; callee: string; args: ExpressionValue[] }
  | { kind: "literal"; value: string | number | boolean };

export interface ExtractedRoute {
  path?: ExpressionValue;
  index?: boolean;
  loader?: { kind: "identifier"; name: string };
  element?: RouteElement;
  children?: ExtractedRoute[];
}
