import { describe, expect, it } from "vitest";
import {
  createInitialRoot,
  addChildToGroup,
  createEmptyGroup,
  removeNodeFromTree,
  reorderChildren,
  countRules,
} from "@/lib/utils/tree";

describe("query tree utilities", () => {
  it("adds nested group immutably", () => {
    const root = createInitialRoot();
    const withGroup = addChildToGroup(root, "root", createEmptyGroup("or"));
    expect(withGroup.children.length).toBe(2);
    expect(withGroup).not.toBe(root);
  });

  it("removes node by id", () => {
    const root = createInitialRoot();
    const ruleId = root.children[0].id;
    const next = removeNodeFromTree(root, ruleId);
    expect(next.children.length).toBe(0);
  });

  it("reorders children within group", () => {
    let root = createInitialRoot();
    const firstId = root.children[0].id;
    root = addChildToGroup(root, "root", {
      id: "r2",
      type: "rule",
      field: "age",
      operator: "equals",
      value: 1,
    });
    const reordered = reorderChildren(root, "root", 0, 1);
    expect(reordered.children[0].id).toBe("r2");
    expect(reordered.children[1].id).toBe(firstId);
  });

  it("counts rules recursively", () => {
    let root = createInitialRoot();
    const group = createEmptyGroup();
    root = addChildToGroup(root, "root", group);
    expect(countRules(root)).toBeGreaterThan(1);
  });
});
