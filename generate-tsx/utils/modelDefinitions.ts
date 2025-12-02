export type ModelFieldType = "";

export type EditingMode = "read only";

export interface ModelField {
  name: string;
  type: ModelFieldType;
  editingMode?: EditingMode;
  to?: string;
  onDelete?: string;
  isParent?: boolean;
  inTable?: boolean;
  isObjectLinkInTable?: boolean;
}

export interface ModelClass {
  name: string;
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
