import type { DataSourceSchema } from "@/lib/types/query";
import type {
  QueryNode,
  QueryRoot,
  QueryRule,
  ValidationIssue,
} from "@/lib/types/query";
import {
  getOperatorsForFieldType,
  operatorNeedsArray,
  operatorNeedsRange,
  operatorNeedsValue,
} from "@/lib/engine/operators";

function validateRule(
  rule: QueryRule,
  schema: DataSourceSchema
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const field = schema.fields.find((f) => f.name === rule.field);

  if (!rule.field) {
    issues.push({
      nodeId: rule.id,
      message: "Select a field",
      severity: "error",
    });
    return issues;
  }

  if (!field) {
    issues.push({
      nodeId: rule.id,
      message: `Unknown field: ${rule.field}`,
      severity: "error",
    });
    return issues;
  }

  const allowed = getOperatorsForFieldType(field.type);
  if (!allowed.includes(rule.operator)) {
    issues.push({
      nodeId: rule.id,
      message: `"${rule.operator}" is not valid for ${field.type} fields`,
      severity: "error",
    });
  }

  if (!operatorNeedsValue(rule.operator)) return issues;

  const value = rule.value;
  if (
    value === "" ||
    value === null ||
    value === undefined ||
    (Array.isArray(value) && value.length === 0)
  ) {
    issues.push({
      nodeId: rule.id,
      message: "Value is required",
      severity: "error",
    });
    return issues;
  }

  if (operatorNeedsRange(rule.operator)) {
    if (
      rule.valueTo === "" ||
      rule.valueTo === null ||
      rule.valueTo === undefined
    ) {
      issues.push({
        nodeId: rule.id,
        message: "End value is required for between",
        severity: "error",
      });
    }
    if (field.type === "number" || field.type === "date") {
      const a = Number(value);
      const b = Number(rule.valueTo);
      if (!Number.isNaN(a) && !Number.isNaN(b) && a > b) {
        issues.push({
          nodeId: rule.id,
          message: "Range start must be less than or equal to end",
          severity: "error",
        });
      }
    }
  }

  if (operatorNeedsArray(rule.operator) && typeof value === "string") {
    const parts = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) {
      issues.push({
        nodeId: rule.id,
        message: "Provide at least one value (comma-separated)",
        severity: "error",
      });
    }
  }

  if (field.type === "number" && rule.operator !== "in_array") {
    const n = Number(value);
    if (Number.isNaN(n)) {
      issues.push({
        nodeId: rule.id,
        message: "Value must be a number",
        severity: "error",
      });
    }
  }

  if (rule.operator === "regex" && typeof value === "string") {
    try {
      new RegExp(value);
    } catch {
      issues.push({
        nodeId: rule.id,
        message: "Invalid regular expression",
        severity: "error",
      });
    }
  }

  return issues;
}

function walkNodes(
  nodes: QueryNode[],
  schema: DataSourceSchema,
  issues: ValidationIssue[]
): void {
  for (const node of nodes) {
    if (node.type === "rule") {
      issues.push(...validateRule(node, schema));
    } else {
      if (node.children.length === 0) {
        issues.push({
          nodeId: node.id,
          message: "Group cannot be empty",
          severity: "error",
        });
      }
      walkNodes(node.children, schema, issues);
    }
  }
}

export function validateQueryTree(
  root: QueryRoot,
  schema: DataSourceSchema
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (root.children.length === 0) {
    issues.push({
      nodeId: root.id,
      message: "Add at least one condition",
      severity: "error",
    });
    return issues;
  }
  walkNodes(root.children, schema, issues);
  return issues;
}

export function isQueryValid(
  root: QueryRoot,
  schema: DataSourceSchema
): boolean {
  return validateQueryTree(root, schema).every((i) => i.severity !== "error");
}

export function getIssuesForNode(
  issues: ValidationIssue[],
  nodeId: string
): ValidationIssue[] {
  return issues.filter((i) => i.nodeId === nodeId);
}
