export type ModelFieldType =
  | "char"
  | "text"
  | "integer"
  | "foreign key"
  | "date"
  | "date time"
  | "fixed enum value"
  | "created at"
  | "order"
  | "file";

export type EditingMode = "read only" | "read write" | "read write once";

export interface ModelField {
  name: string;
  type: ModelFieldType;
  editingMode?: EditingMode;
  to?: string;
  onDelete?: string;
  isParent?: boolean;
  inTable?: boolean;
  isObjectLinkInTable?: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
}

export interface ModelClass {
  name: string;
  shortName: string;
  pluralName: string;
  shortPluralName: string;
  fields: ModelField[];
  ordering: string[];
  initialQueryFilters: string[];
  optionalQueryFilters: string[];
}

export interface ModelDefinitions {
  module: ModelClass;
  widgets: ModelClass[];
  extraClasses: ModelClass[];
}

export const getModels = (definitions: ModelDefinitions) => {
  return [
    definitions.module,
    ...definitions.widgets,
    ...definitions.extraClasses,
  ];
};
