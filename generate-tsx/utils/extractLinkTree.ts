import generate from "@babel/generator";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";

export interface ExtractedConst {
  name: string;
  tsType: string | null;
  fields: Record<string, any>;
}

function stringifyFunction(
  modelImportIndex: Record<string, string>,
  fn: t.ArrowFunctionExpression | t.FunctionExpression
) {
  // Extract param list with TS types preserved
  const params = fn.params.map((p) => generate(p).code);

  // Extract the function body (expression or block)
  let body: string;
  if (t.isBlockStatement(fn.body)) {
    body = generate(fn.body).code;
  } else {
    // Expression-bodied arrow function
    body = generate(fn.body).code;
  }

  const modelMatch = body.match(/as\s+([A-Za-z0-9_]+)/);
  let usesModel: Record<string, string> = {};
  if (modelMatch) {
    const modelName = modelMatch[1];
    const importSource = modelImportIndex[modelName];
    if (importSource) {
      usesModel[modelName] = importSource;
    }
  }

  return { params, body, usesModel };
}

export function extractUrlObjects(code: string): ExtractedConst[] {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  const modelImportIndex: Record<string, string> = {};
  traverse(ast, {
    ImportDeclaration(path) {
      for (const s of path.node.specifiers) {
        if (t.isImportSpecifier(s) && t.isIdentifier(s.imported)) {
          modelImportIndex[s.imported.name] = path.node.source.value;
        }
      }
    },
  });

  const results: ExtractedConst[] = [];
  traverse(ast, {
    VariableDeclaration(path) {
      if (path.node.kind !== "const") return;

      for (const decl of path.node.declarations) {
        if (!t.isVariableDeclarator(decl)) continue;
        if (!t.isIdentifier(decl.id)) continue;

        const id = decl.id;

        // Must have TS type annotation
        if (
          !id.typeAnnotation ||
          !t.isTSTypeAnnotation(id.typeAnnotation) ||
          !id.typeAnnotation.typeAnnotation
        ) {
          continue;
        }

        const tsAnn = id.typeAnnotation.typeAnnotation;

        // Must be an object literal initializer
        if (!t.isObjectExpression(decl.init)) continue;

        const name = id.name;

        // Extract the type name
        let tsType: string | null = null;
        if (t.isTSTypeReference(tsAnn) && t.isIdentifier(tsAnn.typeName)) {
          tsType = tsAnn.typeName.name;
        }

        // Extract object fields
        const fields: Record<string, any> = {};

        for (const prop of decl.init.properties) {
          if (!t.isObjectProperty(prop) || !t.isIdentifier(prop.key)) continue;

          const key = prop.key.name;
          const value = prop.value;

          if (t.isStringLiteral(value)) fields[key] = value.value;
          else if (t.isBooleanLiteral(value)) fields[key] = value.value;
          else if (t.isNumericLiteral(value)) fields[key] = value.value;
          else if (t.isIdentifier(value)) fields[key] = value.name;
          else if (
            t.isArrowFunctionExpression(value) ||
            t.isFunctionExpression(value)
          ) {
            fields[key] = stringifyFunction(modelImportIndex, value);
          }

          // Otherwise leave as raw source
          else {
            fields[key] = generate(value).code;
          }
        }

        results.push({ name, tsType, fields });
      }
    },
  });

  return results;
}
