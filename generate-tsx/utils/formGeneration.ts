import { ClassMap } from "./classMap";
import { ModelClass, ModelField } from "./modelDefinitions";
import { stripPath, toCamel, toPascal } from "./naming";
import { getFieldTranslationKey } from "./translationUtils";

const inForm = (field: ModelField) => {
  if (field.editingMode === "read only") {
    return false;
  }
  if (["fixed enum value", "created at"].includes(field.type)) {
    return false;
  }
  if (field.isParent) {
    return false;
  }
  return true;
};

const getEndpointImports = (item: ModelClass) => {
  const endpoints = [
    `use${toPascal(item.pluralName)}Create`,
    `use${toPascal(item.pluralName)}Destroy`,
    `use${toPascal(item.pluralName)}Update`,
  ];
  return `import { ${endpoints.join(", ")} } from "@/api/endpoints/api"`;
};

const getTypeImports = (item: ModelClass) => {
  const classes = [toPascal(item.name)];
  for (const field of item.fields) {
    if (field.to) {
      if (field.editingMode !== "read only" || field.isParent) {
        classes.push(stripPath(field.to));
      }
    }
  }
  return `import type { ${classes.join(", ")} } from "@/api/models/api"`;
};

const getImports = (item: ModelClass) => {
  const imports = [
    getEndpointImports(item),
    getTypeImports(item),
    'import RootErrorMessage from "@/components/error/form/root-error-message"',
    'import { FormTitle } from "@/components/form/form-title"',
    'import SaveAndDelete from "@/components/form/SaveAndDelete"',
    'import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"',
    'import { Input } from "@/components/ui/input"',
    'import { makeUrl } from "@/helpers/LinkTreeHelper"',
    'import { useErrorHandler } from "@/helpers/useErrorHandler"',
    'import useLinkTree from "@/hooks/UseLinkTree"',
    'import { zodResolver } from "@hookform/resolvers/zod"',
    'import { useCallback } from "react"',
    'import { useForm } from "react-hook-form"',
    'import { useTranslation } from "react-i18next"',
    'import { useNavigate } from "react-router-dom"',
    'import { z } from "zod"',
  ];
  return imports;
};

const getProps = (item: ModelClass) => {
  const props = ['    mode: "Create" | "Update"'];
  for (const field of item.fields) {
    if (field.isParent) {
      props.push(`    ${toCamel(field.name)}: ${stripPath(field.to)}`);
    }
  }
  props.push(`    ${item.shortName}?: ${toPascal(item.name)}`);
  return props;
};

const getMutateArg = (field: ModelField) => {
  if (field.type === "foreign key") {
    return `${toCamel(field.name)}: ${toCamel(field.name)}.id`;
  } else {
    return toCamel(field.name);
  }
};

const getMutateArgs = (item: ModelClass, create: boolean) => {
  const names = [];
  if (create) {
    const parentField = item.fields.find((f) => f.isParent);
    if (parentField) {
      names.push(getMutateArg(parentField));
    }
  }
  for (const field of item.fields) {
    if (inForm(field)) {
      if (field.editingMode === "read write once" && !create) {
        continue;
      }
      names.push(getMutateArg(field));
    }
  }
  return names;
};

const getFormFieldNames = (item: ModelClass) => {
  const names = [];
  for (const field of item.fields) {
    if (!inForm(field)) {
      continue;
    }
    names.push(toCamel(field.name));
  }
  return names;
};

const getFormFieldDefinitions = (item: ModelClass) => {
  const definitions = [];

  for (const field of item.fields) {
    if (!inForm(field)) {
      continue;
    }
    let def = `    ${toCamel(field.name)}: z`;
    switch (field.type) {
      case "char":
      case "text":
        def += ".string()";
        def += field.optional === true ? ".optional()" : "";
        break;
      case "integer":
      case "order":
        def += ".preprocess(Number, z.number())";
        def += field.optional === true ? ".optional()" : "";
        break;
      case "foreign key":
        def += ".string()";
        def += field.optional === true ? ".optional()" : "";
        break;
      case "date time":
        def += ".iso.datetime()";
        def += field.optional === true ? ".optional()" : "";
        break;
      case "date":
        def += ".iso.date()";
        def += field.optional === true ? ".optional()" : "";
        break;
    }

    if (field.minLength !== undefined) {
      def += `.min(${field.minLength})`;
    }
    if (field.maxLength !== undefined) {
      def += `.max(${field.maxLength})`;
    }
    def += ",";
    definitions.push(def);
  }

  return definitions;
};

const getPropsList = (item: ModelClass) => {
  const props = ["mode"];
  for (const field of item.fields) {
    if (field.isParent) {
      props.push(toCamel(field.name));
    }
  }
  props.push(toCamel(item.shortName));
  return props;
};

const getDefaultValue = (field: ModelField) => {
  switch (field.type) {
    case "char":
    case "text":
    case "foreign key":
      return '""';
    case "integer":
    case "order":
      return "0";
    // case "date time":
    //   def += ".string()";
    //   break;
  }
};

const getDefaultValues = (item: ModelClass) => {
  const values = [];
  for (const field of item.fields) {
    if (!inForm(field)) {
      continue;
    }
    const fieldName = toCamel(field.name);
    values.push(
      `            ${fieldName}: mode === "Update" ? ${toCamel(
        item.shortName
      )}!.${fieldName} : ${getDefaultValue(field)}`
    );
  }
  return values;
};

const getNavigateToObject = (classMap: ClassMap, item: ModelClass) => {
  return `    const navigateToObject = useCallback(
        (object: ${toPascal(item.name)}) => {
            navigate(makeUrl(l.${classMap.get(toPascal(item.name)).idName}, [${[
    ...classMap.get(toPascal(item.name)).parentArgs,
    "object",
  ].join(", ")}]))
        },
        [${[
          "navigate",
          "l",
          ...classMap.get(toPascal(item.name)).parentArgs,
        ].join(", ")}]
    )`;
};

const getNavigateToParent = (classMap: ClassMap, item: ModelClass) => {
  const parentField = item.fields.find((f) => f.isParent);
  return parentField
    ? `    const navigateToParent = useCallback(() => {
        navigate(makeUrl(l.${
          classMap.get(stripPath(parentField.to)).idName
        }, [${classMap.get(stripPath(parentField.to)).parentArgs.join(", ")}]))
    }, [${[
      "navigate",
      "l",
      ...classMap.get(toPascal(item.name)).parentArgs,
    ].join(", ")}])`
    : `    const navigateToParent = useCallback(() => {
        navigate(makeUrl(l.MODULES, []))
    }, [navigate, l])`;
};

const getOnSuccess = (item: ModelClass) => {
  return `
    const onSuccess = useCallback(
        (object: ${toPascal(item.name)}) => {
            if (mode === "Create") {
                navigateToObject(object)
            } else if (mode === "Update") {
                navigateToParent()
            }
        },
        [mode, navigateToObject, navigateToParent]
    )`;
};

const getControl = (field: ModelField) => {
  const type = ["order", "integer"].includes(field.type)
    ? `type="number" `
    : "";
  return `                            <FormControl>
                                <Input ${type}{...field} data-cy="${toCamel(
    field.name
  )}Input" />
                            </FormControl>`;
};
const getFormGroups = (item: ModelClass) => {
  const groups = [];
  for (const field of item.fields) {
    if (!inForm(field)) {
      continue;
    }
    groups.push(`                <FormField
                    control={form.control}
                    name="${toCamel(field.name)}"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("${getFieldTranslationKey(
                              item,
                              field
                            )}")}</FormLabel>
${getControl(field)}
                            <FormMessage />
                        </FormItem>
                    )}
                />`);
  }
  return groups;
};

export const writeForm = (
  classMap: ClassMap,
  moduleName: string,
  item: ModelClass
) => {
  return `
${getImports(item).join("\n")}

interface Props {
${getProps(item).join("\n")}
}

const formSchema = z.object({
${getFormFieldDefinitions(item).join("\n")}
})

const ${toPascal(item.name)}Form = ({ ${getPropsList(item)} }: Props) => {
    const { t } = useTranslation()
    const l = useLinkTree()
    const navigate = useNavigate()
    const { handleFormErrors } = useErrorHandler()
    const create = use${toPascal(item.pluralName)}Create()
    const update = use${toPascal(item.pluralName)}Update()
    const destroy = use${toPascal(item.pluralName)}Destroy()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
${getDefaultValues(item).join(",\n")}
        },
    })

${getNavigateToObject(classMap, item)}

${getNavigateToParent(classMap, item)}

${getOnSuccess(item)}

    const onError = useCallback(
        (error: unknown) => {
            handleFormErrors(form.setError, error, [${getFormFieldNames(item)
              .map((n) => `"${n}"`)
              .join(", ")}])
        },
        [handleFormErrors, form.setError]
    )

    const onSubmit = useCallback(
        ({ ${getFormFieldNames(item).join(
          ", "
        )} }: z.infer<typeof formSchema>) => {
            if (mode === "Create") {
                create.mutate({ data: { ${getMutateArgs(item, true).join(
                  ", "
                )} } }, { onSuccess, onError })
            } else if (mode === "Update") {
                update.mutate({ id: ${toCamel(
                  item.shortName
                )}!.id, data: { ${getMutateArgs(item, false).join(
    ", "
  )} } }, { onSuccess, onError })
            }
        },
        [mode, create, update, module, onSuccess, onError]
    )

    const onDelete = useCallback(() => {
        return new Promise((onSuccess, onError) => {
            destroy.mutate({ id: ${toCamel(
              item.shortName
            )}!.id }, { onSuccess, onError })
        })
    }, [destroy, module])
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormTitle>{mode === "Create" ? t("Main.title_new") : ${
                  item.shortName
                }!.name}</FormTitle>
${getFormGroups(item).join("\n")}
                <SaveAndDelete mode={mode} name={${toCamel(
                  item.shortName
                )}?.name ?? ""} onDelete={onDelete} onDeleted={navigateToParent} />
                <RootErrorMessage errors={form.formState.errors} />
            </form>
        </Form>
    )
}

export default ${toPascal(item.name)}Form
`;
};
