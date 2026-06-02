import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConditionGroup } from "@/components/query-builder/condition-group";
import { getSchemaById } from "@/lib/schema/sources";
import { createInitialRoot } from "@/lib/utils/tree";

describe("ConditionGroup", () => {
  it("renders root group and initial rule", () => {
    const schema = getSchemaById("users")!;
    const root = createInitialRoot();
    render(<ConditionGroup group={root} schema={schema} isRoot />);
    expect(screen.getByTestId(`group-${root.id}`)).toBeInTheDocument();
    expect(screen.getByText(/\+ Rule/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Field")).toBeInTheDocument();
  });
});
