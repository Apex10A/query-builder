import type { QueryNode, QueryOperator, QueryRule } from "@/lib/types/query";
import type { QueryRoot } from "@/lib/types/query";

function parseArrayValue(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [value];
}

function ruleToMongo(rule: QueryRule): Record<string, unknown> | null {
  if (!rule.field) return null;
  const field = rule.field;

  switch (rule.operator) {
    case "equals":
      return { [field]: rule.value };
    case "not_equals":
      return { [field]: { $ne: rule.value } };
    case "contains":
      return { [field]: { $regex: String(rule.value), $options: "i" } };
    case "starts_with":
      return {
        [field]: { $regex: `^${String(rule.value)}`, $options: "i" },
      };
    case "greater_than":
      return { [field]: { $gt: rule.value } };
    case "less_than":
      return { [field]: { $lt: rule.value } };
    case "in_array":
      return { [field]: { $in: parseArrayValue(rule.value) } };
    case "between":
      return {
        [field]: { $gte: rule.value, $lte: rule.valueTo },
      };
    case "regex":
      return { [field]: { $regex: String(rule.value) } };
    case "is_null":
      return { [field]: null };
    case "is_not_null":
      return { [field]: { $ne: null } };
    default:
      return null;
  }
}

function combine(
  parts: Record<string, unknown>[],
  logic: "and" | "or"
): Record<string, unknown> | null {
  if (parts.length === 0) return null;
  if (parts.length === 1) return parts[0];
  return { [`$${logic}`]: parts };
}

function nodeToMongo(node: QueryNode): Record<string, unknown> | null {
  if (node.type === "rule") return ruleToMongo(node);

  const parts = node.children
    .map(nodeToMongo)
    .filter((p): p is Record<string, unknown> => p !== null);

  return combine(parts, node.logic);
}

export function generateMongo(root: QueryRoot): string {
  const filter = nodeToMongo(root) ?? {};
  return JSON.stringify(filter, null, 2);
}
