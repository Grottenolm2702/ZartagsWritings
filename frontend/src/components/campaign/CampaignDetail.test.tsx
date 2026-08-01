import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import CampaignDetail from "./CampaignDetail";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

beforeAll(() => {
  Object.defineProperty(HTMLTextAreaElement.prototype, "scrollHeight", {
    configurable: true,
    get() {
      return 140;
    },
  });
});

afterAll(() => {
  Reflect.deleteProperty(HTMLTextAreaElement.prototype, "scrollHeight");
});

test("defaults to preview mode when editable (shows 'Edit' button)", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <CampaignDetail campaignSlug="test" entityType="npc" editable={true} />
    </MemoryRouter>,
  );

  const editButton = screen.getByRole("button", { name: "Edit" });
  expect(editButton).toBeInTheDocument();
});

test("opens discard confirmation and stays on the entity after confirming", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <CampaignDetail
        campaignSlug="test"
        entityType="npc"
        editable={true}
        entity={{
          id: 1,
          type: "npc",
          slug: "villain",
          name: "Villain",
          summary: "Original summary",
          isVisible: true,
          sortOrder: 0,
          headerFields: [{ label: "Name:", value: "Villain" }],
          cards: [],
        }}
      />
    </MemoryRouter>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Edit" }));
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

  expect(
    screen.getByRole("dialog", { name: "Änderungen wirklich verwerfen?" }),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Verwerfen" }));

  expect(
    screen.queryByRole("dialog", { name: "Änderungen wirklich verwerfen?" }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
});

test("auto-resizes the summary textarea in edit mode", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <CampaignDetail
        campaignSlug="test"
        entityType="npc"
        editable={true}
        entity={{
          id: 1,
          type: "npc",
          slug: "villain",
          name: "Villain",
          summary: "A very long summary",
          isVisible: true,
          sortOrder: 0,
          headerFields: [{ label: "Name:", value: "Villain" }],
          cards: [],
        }}
      />
    </MemoryRouter>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Edit" }));

  expect(screen.getByLabelText("Summary")).toHaveStyle({ height: "140px" });
});
