import React from "react";
import { render, screen } from "@testing-library/react";
import CampaignDetail from "./CampaignDetail";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

test("defaults to preview mode when editable (shows 'Bearbeiten' button)", () => {
  render(
    <MemoryRouter>
      <CampaignDetail campaignSlug="test" entityType="npc" editable={true} />
    </MemoryRouter>,
  );

  const editButton = screen.getByRole("button", { name: "Bearbeiten" });
  expect(editButton).toBeInTheDocument();
});
