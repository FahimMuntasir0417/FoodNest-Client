import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmptyState } from "@/components/shared/empty-state";

describe("EmptyState", () => {
  it("renders the title and description", () => {
    render(
      <EmptyState
        title="No meals found"
        description="Try changing your filters."
      />,
    );

    expect(
      screen.getByRole("heading", { name: "No meals found" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Try changing your filters.")).toBeInTheDocument();
  });
});
