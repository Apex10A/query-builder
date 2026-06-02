import { describe, expect, it } from "vitest";
import { generateSql } from "@/lib/engine/sql-generator";
import { getSchemaById } from "@/lib/schema/sources";
import type { QueryRoot } from "@/lib/types/query";

describe("generateSql", () => {
  const schema = getSchemaById("users")!;

  it("generates SELECT with WHERE for simple AND group", () => {
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
        {
          id: "r2",
          type: "rule",
          field: "status",
          operator: "equals",
          value: "active",
        },
      ],
    };
    const sql = generateSql(root, schema);
    expect(sql).toContain("SELECT * FROM users");
    expect(sql).toContain("age > 18");
    expect(sql).toContain("status = 'active'");
    expect(sql).toContain("AND");
  });

  it("escapes single quotes in string values", () => {
    const root: QueryRoot = {
      id: "root",
      type: "group",
      logic: "and",
      children: [
        {
          id: "r1",
          type: "rule",
          field: "name",
          operator: "equals",
          value: "O'Brien",
        },
      ],
    };
    expect(generateSql(root, schema)).toContain("O''Brien");
  });

  it("nests OR groups with parentheses", () => {
    const root: QueryRoot = {
      id: "root",
      type: "group",
      logic: "or",
      children: [
        {
          id: "g1",
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
            {
              id: "r2",
              type: "rule",
              field: "country",
              operator: "equals",
              value: "Nigeria",
            },
          ],
        },
        {
          id: "g2",
          type: "group",
          logic: "and",
          children: [
            {
              id: "r3",
              type: "rule",
              field: "status",
              operator: "equals",
              value: "active",
            },
            {
              id: "r4",
              type: "rule",
              field: "purchases",
              operator: "greater_than",
              value: 10,
            },
          ],
        },
      ],
    };
    const sql = generateSql(root, schema);
    expect(sql).toContain("OR");
    expect(sql).toContain("Nigeria");
    expect(sql).toContain("purchases > 10");
  });
});
