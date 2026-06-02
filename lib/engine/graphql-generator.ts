import type { QueryNode, QueryRule } from "@/lib/types/query";
import type { QueryRoot } from "@/lib/types/query";

function ruleToGraphQL(rule: QueryRule): string | null {
  if (!rule.field) return null;
  const f = rule.field;

  switch (rule.operator) {
    case "equals":
      return `${f}: { eq: ${JSON.stringify(rule.value)} }`;
    case "not_equals":
      return `${f}: { neq: ${JSON.stringify(rule.value)} }`;
    case "contains":
      return `${f}: { contains: ${JSON.stringify(String(rule.value))} }`;
    case "starts_with":
      return `${f}: { startsWith: ${JSON.stringify(String(rule.value))} }`;
    case "greater_than":
      return `${f}: { gt: ${JSON.stringify(rule.value)} }`;
    case "less_than":
      return `${f}: { lt: ${JSON.stringify(rule.value)} }`;
    case "in_array":
      return `${f}: { in: ${JSON.stringify(
        typeof rule.value === "string"
          ? rule.value.split(",").map((s) => s.trim())
          : rule.value
      )} }`;
    case "between":
      return `${f}: { gte: ${JSON.stringify(rule.value)}, lte: ${JSON.stringify(rule.valueTo)} }`;
    case "regex":
      return `${f}: { regex: ${JSON.stringify(String(rule.value))} }`;
    case "is_null":
      return `${f}: { isNull: true }`;
    case "is_not_null":
      return `${f}: { isNull: false }`;
    default:
      return null;
  }
}

function nodeToGraphQL(node: QueryNode, indent: number): string | null {
  if (node.type === "rule") return ruleToGraphQL(node);

  const pad = "  ".repeat(indent);
  const childPad = "  ".repeat(indent + 1);
  const parts = node.children
    .map((c) => {
      const inner = nodeToGraphQL(c, indent + 2);
      return inner ? `${childPad}${inner}` : null;
    })
    .filter((p): p is string => p !== null);

  if (parts.length === 0) return null;
  const logicKey = node.logic === "and" ? "_and" : "_or";
  return `${pad}${logicKey}: [\n${parts.join(",\n")}\n${pad}]`;
}

export function generateGraphQL(root: QueryRoot): string {
  const filter = nodeToGraphQL(root, 1);
  if (!filter) return "filter: {}";
  return `filter: {\n${filter}\n}`;
}
