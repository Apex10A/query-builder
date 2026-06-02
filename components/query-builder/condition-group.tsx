"use client";

import { memo, useCallback, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { DataSourceSchema, QueryGroup, QueryRoot } from "@/lib/types/query";
import { useQueryStore } from "@/lib/store/query-store";
import {
  addChildToGroup,
  createEmptyGroup,
  createEmptyRule,
  removeNodeFromTree,
  reorderChildren,
  updateNodeInTree,
} from "@/lib/utils/tree";
import { RuleRow } from "./rule-row";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { getIssuesForNode } from "@/lib/engine/validation";

interface ConditionGroupProps {
  group: QueryGroup | QueryRoot;
  schema: DataSourceSchema;
  depth?: number;
  isRoot?: boolean;
}

function ConditionGroupComponent({
  group,
  schema,
  depth = 0,
  isRoot = false,
}: ConditionGroupProps) {
  const root = useQueryStore((s) => s.root);
  const setRootTree = useQueryStore((s) => s.setRoot);
  const validationIssues = useQueryStore((s) => s.validationIssues);

  const issues = getIssuesForNode(validationIssues, group.id);
  const childIds = useMemo(() => group.children.map((c) => c.id), [group.children]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const toggleLogic = useCallback(() => {
    setRootTree(
      updateNodeInTree(root, group.id, (node) => {
        if (node.type !== "group") return node;
        return { ...node, logic: node.logic === "and" ? "or" : "and" };
      })
    );
  }, [group.id, root, setRootTree]);

  const toggleCollapsed = useCallback(() => {
    if (isRoot) return;
    setRootTree(
      updateNodeInTree(root, group.id, (node) => {
        if (node.type !== "group") return node;
        return { ...node, collapsed: !node.collapsed };
      })
    );
  }, [group.id, isRoot, root, setRootTree]);

  const addRule = useCallback(() => {
    setRootTree(addChildToGroup(root, group.id, createEmptyRule()));
  }, [group.id, root, setRootTree]);

  const addGroup = useCallback(() => {
    setRootTree(addChildToGroup(root, group.id, createEmptyGroup()));
  }, [group.id, root, setRootTree]);

  const removeChild = useCallback(
    (id: string) => {
      if (group.children.length <= 1 && isRoot) return;
      setRootTree(removeNodeFromTree(root, id));
    },
    [group.children.length, isRoot, root, setRootTree]
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const from = group.children.findIndex((c) => c.id === active.id);
      const to = group.children.findIndex((c) => c.id === over.id);
      if (from >= 0 && to >= 0) {
        setRootTree(reorderChildren(root, group.id, from, to));
      }
    },
    [group.children, group.id, root, setRootTree]
  );

  const collapsed =
    !isRoot && group.type === "group" && Boolean((group as QueryGroup).collapsed);

  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-200",
        !isRoot && "border border-dashed border-violet-300/60 dark:border-violet-700/50 bg-violet-50/30 dark:bg-violet-950/20 p-3",
        depth > 0 && "ml-2 sm:ml-4"
      )}
      data-testid={`group-${group.id}`}
      style={{ marginLeft: isRoot ? 0 : Math.min(depth * 8, 32) }}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {!isRoot && (
          <button
            type="button"
            onClick={toggleCollapsed}
            className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            aria-expanded={!collapsed}
          >
            {collapsed ? "▶" : "▼"}
          </button>
        )}
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          {isRoot ? "Root" : "Group"}
        </span>
        <button
          type="button"
          onClick={toggleLogic}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-bold transition-colors duration-150",
            group.logic === "and"
              ? "bg-violet-600 text-white"
              : "bg-amber-500 text-white"
          )}
        >
          {group.logic.toUpperCase()}
        </button>
        {!isRoot && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeChild(group.id)}
            aria-label="Remove group"
          >
            Remove group
          </Button>
        )}
      </div>

      {!collapsed && (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-2">
                {group.children.map((child) =>
                  child.type === "rule" ? (
                    <RuleRow
                      key={child.id}
                      rule={child}
                      schema={schema}
                      onRemove={() => removeChild(child.id)}
                    />
                  ) : (
                    <ConditionGroup
                      key={child.id}
                      group={child}
                      schema={schema}
                      depth={depth + 1}
                    />
                  )
                )}
              </div>
            </SortableContext>
          </DndContext>

          {issues.length > 0 && (
            <p className="mt-2 text-xs text-red-600">{issues[0]?.message}</p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={addRule}>
              + Rule
            </Button>
            <Button size="sm" variant="secondary" onClick={addGroup}>
              + Nested group
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export const ConditionGroup = memo(ConditionGroupComponent);
