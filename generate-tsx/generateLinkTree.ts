interface FunctionField {
  params: string[];
  body: string;
}

interface ExtractedConst {
  name: string;
  tsType: string;
  fields: Record<string, string | number | boolean | FunctionField | null>;
}

export function generateLinkTreeFile(items: ExtractedConst[]): string {
  const IMPORTS = [
    `import type { StaticUrlItem, VariableUrlItem } from "@/helpers/LinkTreeHelper"`,
    `import { useMemo } from "react"`,
    `import { useTranslation } from "react-i18next"`,
  ];

  const dynamicImports: Record<string, Set<string>> = {};

  for (const item of items) {
    for (const [field, val] of Object.entries(item.fields)) {
      if (typeof val === "object" && val && "usesModel" in val) {
        const usesModel = val.usesModel as Record<string, string>;

        for (const [modelName, importPath] of Object.entries(usesModel)) {
          if (!dynamicImports[importPath]) {
            dynamicImports[importPath] = new Set();
          }
          dynamicImports[importPath].add(modelName);
        }
      }
    }
  }

  const importLines = Object.entries(dynamicImports).map(([src, models]) => {
    return `import type { ${Array.from(models).join(", ")} } from "${src}"`;
  });

  const formatFieldValue = (key: string, v: any): string => {
    if (typeof v === "string") {
      if (key === "parent") return v;
      if (key === "title" && v.length > 0) return v;
      if (key === "toTitle") return v;
      if (key === "hrefPart") return v;
      return JSON.stringify(v);
    }
    if (typeof v === "boolean") return v ? "true" : "false";
    if (typeof v === "number") return v.toString();
    if (typeof v === "object" && v !== null && "body" in v) {
      const fn = v as FunctionField;
      return `(${fn.params.join(", ")}) => ${fn.body}`;
    }
    if (typeof v === "object" && v !== null) {
      return v.toString();
    }
    return "null";
  };

  const constBlocks = items
    .map((item) => {
      const fields = Object.entries(item.fields)
        .map(
          ([key, val]) => `            ${key}: ${formatFieldValue(key, val)},`
        )
        .join("\n");

      return `
        const ${item.name}: ${item.tsType} = {
${fields}
        }`;
    })
    .join("");

  const returnBlock = `
        return {
${items.map((x) => `            ${x.name},`).join("\n")}
        }`;

  return (
    `
${importLines.join("\n")}
${IMPORTS.join("\n")}

const useLinkTree = () => {
    const { t } = useTranslation()

    return useMemo(() => {${constBlocks}
${returnBlock}
    }, [t])
}

export default useLinkTree
`.trim() + "\n"
  );
}
