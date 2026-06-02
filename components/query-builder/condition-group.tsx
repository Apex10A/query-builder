"use client";

import { memo, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
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
      className={cn(!isRoot && "workflow-nest", depth > 0 && "ml-4")}
      data-testid={`group-${group.id}`}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {!isRoot && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={toggleCollapsed}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-xs text-[var(--fg-muted)]"
            aria-expanded={!collapsed}
          >
            {collapsed ? "▶" : "▼"}
          </motion.button>
        )}
        {!isRoot && (
          <span className="text-xs font-semibold text-[var(--fg-muted)]">
            Nested group
          </span>
        )}
        <motion.button
          whileTap={{ scale: 0.94 }}
          type="button"
          onClick={toggleLogic}
          className={cn(
            "logic-chip",
            group.logic === "and" ? "logic-chip-and" : "logic-chip-or"
          )}
        >
          {group.logic.toUpperCase()}
        </motion.button>
        {!isRoot && (
          <button
            type="button"
            onClick={() => removeChild(group.id)}
            className="ml-auto text-xs text-[var(--fg-muted)] hover:text-[var(--danger)]"
          >
            Remove
          </button>
        )}
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={childIds}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-0">
                  {group.children.map((child, index) => (
                    <div key={child.id}>
                      {index > 0 && <div className="workflow-connector" />}
                      {child.type === "rule" ? (
                        <RuleRow
                          rule={child}
                          schema={schema}
                          onRemove={() => removeChild(child.id)}
                          index={index}
                        />
                      ) : (
                        <ConditionGroup
                          group={child}
                          schema={schema}
                          depth={depth + 1}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {issues.length > 0 && (
              <p className="mt-2 text-xs text-[var(--danger)]">
                {issues[0]?.message}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={addRule}
                className="lantern-btn-secondary rounded-lg px-4 py-2 text-xs font-semibold"
              >
                + Add condition
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={addGroup}
                className="lantern-btn-secondary rounded-lg px-4 py-2 text-xs font-semibold"
              >
                + Add group
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const ConditionGroup = memo(ConditionGroupComponent);
