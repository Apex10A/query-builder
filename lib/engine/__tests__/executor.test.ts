import { describe, expect, it } from "vitest";
import { executeQuery, paginateResults } from "@/lib/engine/executor";
import { MOCK_USERS } from "@/lib/data/mock-dataset";
import type { QueryRoot } from "@/lib/types/query";

describe("executeQuery", () => {
  it("filters by AND conditions", () => {
    const root: QueryRoot = {
      id: "root",
      type: "group",
      logic: "and",
      children: [
        {
          id: "r1",
          type: "rule",
          field: "country",
          operator: "equals",
          value: "Nigeria",
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
    const results = executeQuery(root, MOCK_USERS);
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Margaret Hamilton");
  });

  it("filters by OR at root", () => {
    const root: QueryRoot = {
      id: "root",
      type: "group",
      logic: "or",
      children: [
        {
          id: "r1",
          type: "rule",
          field: "age",
          operator: "less_than",
          value: 20,
        },
        {
          id: "r2",
          type: "rule",
          field: "purchases",
          operator: "greater_than",
          value: 40,
        },
      ],
    };
    const results = executeQuery(root, MOCK_USERS);
    expect(results.length).toBeGreaterThan(1);
  });
});

describe("paginateResults", () => {
  it("returns correct page slices", () => {
    const data = [1, 2, 3, 4, 5];
    const page1 = paginateResults(data, 1, 2);
    expect(page1.data).toEqual([1, 2]);
    expect(page1.totalPages).toBe(3);
  });
});
