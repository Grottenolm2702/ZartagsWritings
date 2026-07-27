import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import EditableCardContent from "./EditableCardContent";
import type { ApiCardContent } from "../../types/campaign-api";

beforeAll(() => {
  Object.defineProperty(HTMLTextAreaElement.prototype, "scrollHeight", {
    configurable: true,
    get() {
      return 120;
    },
  });
});

afterAll(() => {
  Reflect.deleteProperty(HTMLTextAreaElement.prototype, "scrollHeight");
});

test("lets the user remove individual paragraphs", () => {
  const onChange = vi.fn();
  const content: ApiCardContent = {
    type: "paragraphs",
    paragraphs: ["First", "Second"],
  };

  render(<EditableCardContent content={content} onChange={onChange} />);

  fireEvent.click(screen.getByRole("button", { name: "Remove paragraph 1" }));

  expect(onChange).toHaveBeenCalledWith({
    type: "paragraphs",
    paragraphs: ["Second"],
  });
});

test("auto-resizes paragraph textareas to fit their content", () => {
  const content: ApiCardContent = {
    type: "paragraph",
    text: "Long text",
  };

  render(<EditableCardContent content={content} />);

  expect(screen.getByRole("textbox", { name: "Paragraph" })).toHaveStyle({ height: "120px" });
});

test("lets the user remove individual list entries", () => {
  const onChange = vi.fn();
  const content: ApiCardContent = {
    type: "list",
    items: [
      { label: "First", href: undefined },
      { label: "Second", href: undefined },
    ],
  };

  render(<EditableCardContent content={content} onChange={onChange} />);

  fireEvent.click(screen.getByRole("button", { name: "Remove entry 1" }));

  expect(onChange).toHaveBeenCalledWith({
    type: "list",
    items: [{ label: "Second", href: undefined }],
  });
});

test("auto-resizes list textareas to fit their content", () => {
  const content: ApiCardContent = {
    type: "list",
    items: [{ label: "Long entry text", href: "https://example.com/very/long/link" }],
  };

  render(<EditableCardContent content={content} />);

  expect(screen.getByRole("textbox", { name: "Entry 1 label" })).toHaveStyle({ height: "120px" });
});
