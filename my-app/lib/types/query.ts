export type LogicOperator = "and" | "or";

export type FieldType = "string" | "number" | "boolean" | "date" | "enum";

export type QueryOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "starts_with"
  | "greater_than"
  | "less_than"
  | "in_array"
  | "between"
  | "regex"
  | "is_null"
  | "is_not_null";

export type PreviewFormat = "sql" | "mongo" | "graphql";

export interface SchemaField {
  name: string;
  type: FieldType;
  label?: string;
  enumValues?: string[];
}

export interface DataSourceSchema {
  id: string;
  name: string;
  tableName: string;
  fields: SchemaField[];
}

export interface QueryRule {
  id: string;
  type: "rule";
  field: string;
  operator: QueryOperator;
  value: unknown;
  valueTo?: unknown;
}

export interface QueryGroup {
  id: string;
  type: "group";
  logic: LogicOperator;
  children: QueryNode[];
  collapsed?: boolean;
}

export type QueryNode = QueryRule | QueryGroup;

export interface QueryRoot {
  id: string;
  type: "group";
  logic: LogicOperator;
  children: QueryNode[];
}

export interface ValidationIssue {
  nodeId: string;
  message: string;
  severity: "error" | "warning";
}

export interface QueryPreset {
  id: string;
  name: string;
  schemaId: string;
  root: QueryRoot;
  createdAt: number;
}

export interface HistoryEntry {
  id: string;
  label: string;
  timestamp: number;
  root: QueryRoot;
  schemaId: string;
}
