import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import ItemsGrid from "./ItemsGrid";
import type { ApiCardSpec } from "../../types/campaign-api";

test("moves cards up and down via arrow buttons", () => {
  const onMove = vi.fn();
  const cards: ApiCardSpec[] = [
    { title: "First", content: { type: "paragraph", text: "One" } },
    { title: "Second", content: { type: "paragraph", text: "Two" } },
  ];

  render(<ItemsGrid cards={cards} editable={true} onMove={onMove} />);

  fireEvent.click(screen.getByRole("button", { name: "Move First down" }));
  fireEvent.click(screen.getByRole("button", { name: "Move Second up" }));

  expect(onMove).toHaveBeenNthCalledWith(1, 0, 1);
  expect(onMove).toHaveBeenNthCalledWith(2, 1, -1);
});
