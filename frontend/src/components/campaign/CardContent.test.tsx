import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import CardContent from "./CardContent";
import type { ApiCardContent } from "../../types/campaign-api";

test("renders same-origin campaign links as router links", () => {
  const content: ApiCardContent = {
    type: "list",
    items: [
      {
        label: "Jaru",
        href: `${window.location.origin}/campaigns/vergessene-geschichten-kavantas/pc/jaru-zachadl-skelga-hamminstym`,
      },
    ],
  };

  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CardContent content={content} />
    </MemoryRouter>,
  );

  expect(screen.getByRole("link", { name: "Jaru" })).toHaveAttribute(
    "href",
    "/campaigns/vergessene-geschichten-kavantas/pc/jaru-zachadl-skelga-hamminstym",
  );
});

test("keeps external links as anchors", () => {
  const content: ApiCardContent = {
    type: "list",
    items: [{ label: "Docs", href: "https://example.com/docs" }],
  };

  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CardContent content={content} />
    </MemoryRouter>,
  );

  const link = screen.getByRole("link", { name: "Docs" });
  expect(link).toHaveAttribute("href", "https://example.com/docs");
  expect(link).toHaveAttribute("target", "_blank");
});
