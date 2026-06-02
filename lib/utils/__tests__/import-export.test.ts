import { describe, expect, it } from "vitest";
import { exportQueryJson, importQueryJson } from "@/lib/utils/import-export";
import { createInitialRoot } from "@/lib/utils/tree";

describe("import-export", () => {
  it("round-trips query JSON", () => {
    const root = createInitialRoot();
    const json = exportQueryJson("users", root);
    const imported = importQueryJson(json);
    expect(imported.schemaId).toBe("users");
    expect(imported.root.type).toBe("group");
  });

  it("rejects malformed JSON", () => {
    expect(() => importQueryJson("{ bad")).toThrow("Invalid JSON");
  });

  it("rejects excessive depth", () => {
    let node: Record<string, unknown> = {
      id: "root",
      type: "group",
      logic: "and",
      children: [],
    };
    let current = node;
    for (let i = 0; i < 60; i++) {
      const child = {
        id: `g${i}`,
        type: "group",
        logic: "and",
        children: [],
      };
      (current.children as unknown[]).push(child);
      current = child;
    }
    const payload = JSON.stringify({
      version: 1,
      schemaId: "users",
      root: node,
      exportedAt: new Date().toISOString(),
    });
    expect(() => importQueryJson(payload)).toThrow();
  });
});
