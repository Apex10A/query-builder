import { describe, expect, it } from "vitest";
import { validateQueryTree, isQueryValid } from "@/lib/engine/validation";
import { getSchemaById } from "@/lib/schema/sources";
import type { QueryRoot } from "@/lib/types/query";

describe("validateQueryTree", () => {
  const schema = getSchemaById("users")!;

  it("flags empty field", () => {
    const root: QueryRoot = {
      id: "root",
      type: "group",
      logic: "and",
      children: [
        { id: "r1", type: "rule", field: "", operator: "equals", value: "x" },
      ],
    };
    const issues = validateQueryTree(root, schema);
    expect(issues.some((i) => i.message === "Select a field")).toBe(true);
  });

  it("prevents contains on number fields", () => {
    const root: QueryRoot = {
      id: "root",
      type: "group",
      logic: "and",
      children: [
        {
          id: "r1",
          type: "rule",
          field: "age",
          operator: "contains",
          value: "18",
        },
      ],
    };
    const issues = validateQueryTree(root, schema);
    expect(issues.length).toBeGreaterThan(0);
    expect(isQueryValid(root, schema)).toBe(false);
  });

  it("flags empty nested groups", () => {
    const root: QueryRoot = {
      id: "root",
      type: "group",
      logic: "and",
      children: [
        { id: "g1", type: "group", logic: "and", children: [] },
      ],
    };
    expect(validateQueryTree(root, schema).some((i) => i.message.includes("empty"))).toBe(
      true
    );
  });

  it("accepts valid complete rules", () => {
    const root: QueryRoot = {
      id: "root",
      type: "group",
      logic: "and",
      children: [
        {
          id: "r1",
          type: "rule",
          field: "age",
          operator: "greater_than",
          value: 18,
        },
      ],
    };
    expect(isQueryValid(root, schema)).toBe(true);
  });
});
