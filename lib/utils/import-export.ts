import type { QueryRoot } from "@/lib/types/query";

const MAX_DEPTH = 50;
const MAX_NODES = 500;

export interface ExportedQuery {
  version: 1;
  schemaId: string;
  root: QueryRoot;
  exportedAt: string;
}

function countNodes(root: QueryRoot, depth = 0): number {
  if (depth > MAX_DEPTH) throw new Error("Query tree exceeds maximum depth");
  let count = 1;
  for (const child of root.children) {
    if (child.type === "group") {
      count += countNodes(child as QueryRoot, depth + 1);
    } else {
      count += 1;
    }
  }
  if (count > MAX_NODES) throw new Error("Query tree exceeds maximum node count");
  return count;
}

function isQueryRule(obj: unknown): boolean {
  if (!obj || typeof obj !== "object") return false;
  const r = obj as Record<string, unknown>;
  return r.type === "rule" && typeof r.id === "string";
}

function isQueryGroup(obj: unknown): boolean {
  if (!obj || typeof obj !== "object") return false;
  const g = obj as Record<string, unknown>;
  return (
    g.type === "group" &&
    typeof g.id === "string" &&
    (g.logic === "and" || g.logic === "or") &&
    Array.isArray(g.children)
  );
}

function sanitizeNode(node: unknown, depth: number): unknown {
  if (depth > MAX_DEPTH) throw new Error("Invalid nested structure");
  if (isQueryRule(node)) {
    const r = node as Record<string, unknown>;
    return {
      id: String(r.id).slice(0, 64),
      type: "rule",
      field: typeof r.field === "string" ? r.field.slice(0, 128) : "",
      operator: typeof r.operator === "string" ? r.operator : "equals",
      value: r.value,
      ...(r.valueTo !== undefined ? { valueTo: r.valueTo } : {}),
    };
  }
  if (isQueryGroup(node)) {
    const g = node as Record<string, unknown>;
    return {
      id: String(g.id).slice(0, 64),
      type: "group",
      logic: g.logic,
      collapsed: Boolean(g.collapsed),
      children: (g.children as unknown[]).map((c) =>
        sanitizeNode(c, depth + 1)
      ),
    };
  }
  throw new Error("Invalid query node in import");
}

export function exportQueryJson(
  schemaId: string,
  root: QueryRoot
): string {
  const payload: ExportedQuery = {
    version: 1,
    schemaId,
    root,
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(payload, null, 2);
}

export function importQueryJson(
  json: string
): { schemaId: string; root: QueryRoot } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("Invalid JSON");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid export format");
  }

  const data = parsed as Record<string, unknown>;
  if (data.version !== 1) throw new Error("Unsupported export version");
  if (typeof data.schemaId !== "string") throw new Error("Missing schemaId");

  const root = sanitizeNode(data.root, 0) as QueryRoot;
  countNodes(root);
  return { schemaId: data.schemaId, root };
}
