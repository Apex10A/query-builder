import type { FieldType, QueryOperator } from "@/lib/types/query";

export const OPERATOR_LABELS: Record<QueryOperator, string> = {
  equals: "Equals",
  not_equals: "Not Equals",
  contains: "Contains",
  starts_with: "Starts With",
  greater_than: "Greater Than",
  less_than: "Less Than",
  in_array: "In Array",
  between: "Between",
  regex: "Regex",
  is_null: "Is Null",
  is_not_null: "Is Not Null",
};

const OPERATORS_BY_TYPE: Record<FieldType, QueryOperator[]> = {
  string: [
    "equals",
    "not_equals",
    "contains",
    "starts_with",
    "in_array",
    "regex",
    "is_null",
    "is_not_null",
  ],
  number: [
    "equals",
    "not_equals",
    "greater_than",
    "less_than",
    "between",
    "in_array",
    "is_null",
    "is_not_null",
  ],
  boolean: ["equals", "not_equals", "is_null", "is_not_null"],
  date: [
    "equals",
    "not_equals",
    "greater_than",
    "less_than",
    "between",
    "is_null",
    "is_not_null",
  ],
  enum: ["equals", "not_equals", "in_array", "is_null", "is_not_null"],
};

export function getOperatorsForFieldType(type: FieldType): QueryOperator[] {
  return OPERATORS_BY_TYPE[type] ?? OPERATORS_BY_TYPE.string;
}

export function operatorNeedsValue(operator: QueryOperator): boolean {
  return operator !== "is_null" && operator !== "is_not_null";
}

export function operatorNeedsRange(operator: QueryOperator): boolean {
  return operator === "between";
}

export function operatorNeedsArray(operator: QueryOperator): boolean {
  return operator === "in_array";
}
