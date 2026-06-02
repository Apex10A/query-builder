import type { DataSourceSchema } from "@/lib/types/query";
import type { QueryNode, QueryOperator, QueryRule } from "@/lib/types/query";
import { operatorNeedsValue } from "@/lib/engine/operators";

function escapeSqlString(value: string): string {
  return value.replace(/'/g, "''");
}

function formatValue(value: unknown, operator: QueryOperator): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    return value.map((v) => `'${escapeSqlString(String(v))}'`).join(", ");
  }
  if (operator === "in_array" && typeof value === "string") {
    const parts = value.split(",").map((s) => s.trim()).filter(Boolean);
    return parts.map((v) => `'${escapeSqlString(v)}'`).join(", ");
  }
  return `'${escapeSqlString(String(value))}'`;
}

function ruleToSql(rule: QueryRule): string | null {
  if (!rule.field) return null;
  const col = rule.field;

  switch (rule.operator) {
    case "equals":
      return `${col} = ${formatValue(rule.value, rule.operator)}`;
    case "not_equals":
      return `${col} <> ${formatValue(rule.value, rule.operator)}`;
    case "contains":
      return `${col} LIKE '%' || ${formatValue(rule.value, rule.operator)} || '%'`;
    case "starts_with":
      return `${col} LIKE ${formatValue(rule.value, rule.operator)} || '%'`;
    case "greater_than":
      return `${col} > ${formatValue(rule.value, rule.operator)}`;
    case "less_than":
      return `${col} < ${formatValue(rule.value, rule.operator)}`;
    case "in_array": {
      const vals = formatValue(rule.value, rule.operator);
      return `${col} IN (${vals})`;
    }
    case "between":
      return `${col} BETWEEN ${formatValue(rule.value, rule.operator)} AND ${formatValue(rule.valueTo, rule.operator)}`;
    case "regex":
      return `${col} ~ ${formatValue(rule.value, rule.operator)}`;
    case "is_null":
      return `${col} IS NULL`;
    case "is_not_null":
      return `${col} IS NOT NULL`;
    default:
      return null;
  }
}

function nodeToSql(node: QueryNode): string | null {
  if (node.type === "rule") {
    if (!operatorNeedsValue(node.operator) || node.field) {
      return ruleToSql(node);
    }
    return null;
  }

  const parts = node.children
    .map(nodeToSql)
    .filter((p): p is string => p !== null && p.length > 0);

  if (parts.length === 0) return null;
  const joiner = node.logic.toUpperCase();
  return `(${parts.join(` ${joiner} `)})`;
}

export function generateSql(
  root: QueryRoot,
  schema: DataSourceSchema
): string {
  const where = nodeToSql(root);
  const base = `SELECT * FROM ${schema.tableName}`;
  if (!where) return `${base};`;
  return `${base}\nWHERE ${where};`;
}
