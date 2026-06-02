import type { QueryNode, QueryOperator, QueryRule } from "@/lib/types/query";
import type { QueryRoot } from "@/lib/types/query";
import type { MockRecord } from "@/lib/data/mock-dataset";

function getFieldValue(record: MockRecord, field: string): unknown {
  return record[field];
}

function parseArrayValue(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [value];
}

function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (typeof a === "number" && typeof b === "number") return a - b;
  const sa = String(a);
  const sb = String(b);
  return sa.localeCompare(sb);
}

function evaluateRule(record: MockRecord, rule: QueryRule): boolean {
  if (!rule.field) return false;
  const raw = getFieldValue(record, rule.field);
  const op = rule.operator;

  if (op === "is_null") return raw === null || raw === undefined;
  if (op === "is_not_null") return raw !== null && raw !== undefined;

  const value = rule.value;

  switch (op) {
    case "equals":
      return String(raw) === String(value);
    case "not_equals":
      return String(raw) !== String(value);
    case "contains":
      return String(raw).toLowerCase().includes(String(value).toLowerCase());
    case "starts_with":
      return String(raw)
        .toLowerCase()
        .startsWith(String(value).toLowerCase());
    case "greater_than":
      return compareValues(raw, value) > 0;
    case "less_than":
      return compareValues(raw, value) < 0;
    case "in_array": {
      const arr = parseArrayValue(value).map(String);
      return arr.includes(String(raw));
    }
    case "between":
      return compareValues(raw, value) >= 0 && compareValues(raw, rule.valueTo) <= 0;
    case "regex": {
      try {
        return new RegExp(String(value), "i").test(String(raw));
      } catch {
        return false;
      }
    }
    default:
      return false;
  }
}

function evaluateNode(record: MockRecord, node: QueryNode): boolean {
  if (node.type === "rule") return evaluateRule(record, node);
  if (node.children.length === 0) return false;
  if (node.logic === "and") {
    return node.children.every((c) => evaluateNode(record, c));
  }
  return node.children.some((c) => evaluateNode(record, c));
}

export function executeQuery(
  root: QueryRoot,
  dataset: MockRecord[]
): MockRecord[] {
  return dataset.filter((record) => evaluateNode(record, root));
}

export type SortDirection = "asc" | "desc";

export function sortResults(
  records: MockRecord[],
  field: string,
  direction: SortDirection
): MockRecord[] {
  const sorted = [...records];
  sorted.sort((a, b) => {
    const cmp = compareValues(a[field], b[field]);
    return direction === "asc" ? cmp : -cmp;
  });
  return sorted;
}

export function paginateResults<T>(
  records: T[],
  page: number,
  pageSize: number
): { data: T[]; total: number; totalPages: number } {
  const total = records.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    data: records.slice(start, start + pageSize),
    total,
    totalPages,
  };
}
