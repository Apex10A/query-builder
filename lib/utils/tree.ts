import { nanoid } from "nanoid";
import type {
  QueryGroup,
  QueryNode,
  QueryRoot,
  QueryRule,
} from "@/lib/types/query";

export function createEmptyRule(): QueryRule {
  return {
    id: nanoid(),
    type: "rule",
    field: "",
    operator: "equals",
    value: "",
  };
}

export function createEmptyGroup(logic: "and" | "or" = "and"): QueryGroup {
  return {
    id: nanoid(),
    type: "group",
    logic,
    children: [createEmptyRule()],
    collapsed: false,
  };
}

export function createInitialRoot(): QueryRoot {
  return {
    id: "root",
    type: "group",
    logic: "and",
    children: [createEmptyRule()],
  };
}

export function cloneRoot(root: QueryRoot): QueryRoot {
  return JSON.parse(JSON.stringify(root)) as QueryRoot;
}

export function findNode(
  root: QueryRoot,
  nodeId: string
): { node: QueryNode; parent: QueryGroup | QueryRoot; index: number } | null {
  function walk(
    parent: QueryGroup | QueryRoot,
    children: QueryNode[]
  ): { node: QueryNode; parent: QueryGroup | QueryRoot; index: number } | null {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.id === nodeId) {
        return { node: child, parent, index: i };
      }
      if (child.type === "group") {
        const found = walk(child, child.children);
        if (found) return found;
      }
    }
    return null;
  }
  return walk(root, root.children);
}

export function updateNodeInTree(
  root: QueryRoot,
  nodeId: string,
  updater: (node: QueryNode) => QueryNode
): QueryRoot {
  if (nodeId === root.id) {
    const updated = updater(root);
    if (updated.type !== "group") {
      throw new Error("Root node must remain a group");
    }
    return updated as QueryRoot;
  }

  const next = cloneRoot(root);

  function walk(parent: QueryGroup | QueryRoot, children: QueryNode[]): void {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.id === nodeId) {
        children[i] = updater(child);
        return;
      }
      if (child.type === "group") {
        walk(child, child.children);
      }
    }
  }

  walk(next, next.children);
  return next;
}

export function removeNodeFromTree(root: QueryRoot, nodeId: string): QueryRoot {
  const next = cloneRoot(root);

  function walk(parent: QueryGroup | QueryRoot, children: QueryNode[]): boolean {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.id === nodeId) {
        children.splice(i, 1);
        return true;
      }
      if (child.type === "group" && walk(child, child.children)) {
        return true;
      }
    }
    return false;
  }

  walk(next, next.children);
  return next;
}

export function addChildToGroup(
  root: QueryRoot,
  groupId: string,
  child: QueryNode
): QueryRoot {
  return updateNodeInTree(root, groupId, (node) => {
    if (node.type !== "group") return node;
    return { ...node, children: [...node.children, child] };
  });
}

export function reorderChildren(
  root: QueryRoot,
  groupId: string,
  fromIndex: number,
  toIndex: number
): QueryRoot {
  return updateNodeInTree(root, groupId, (node) => {
    if (node.type !== "group") return node;
    const children = [...node.children];
    const [moved] = children.splice(fromIndex, 1);
    children.splice(toIndex, 0, moved);
    return { ...node, children };
  });
}

export function countRules(root: QueryRoot): number {
  let count = 0;
  function walk(nodes: QueryNode[]): void {
    for (const n of nodes) {
      if (n.type === "rule") count++;
      else walk(n.children);
    }
  }
  walk(root.children);
  return count;
}

export function maxDepth(root: QueryRoot, depth = 1): number {
  let max = depth;
  for (const child of root.children) {
    if (child.type === "group") {
      max = Math.max(max, maxDepth(child as QueryRoot, depth + 1));
    }
  }
  return max;
}
