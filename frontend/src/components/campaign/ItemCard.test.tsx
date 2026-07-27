import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ItemCard from "./ItemCard";
import type { ApiCardSpec } from "../../types/campaign-api";

test("shows the order number in edit mode before the move buttons", () => {
  const card: ApiCardSpec = {
    title: "General",
    content: { type: "paragraph", text: "Text" },
  };

  render(
    <ItemCard card={card} editable={true} orderNumber={3}>
      <div />
    </ItemCard>,
  );

  expect(screen.getByLabelText("Card order 3")).toHaveTextContent("3");
});
