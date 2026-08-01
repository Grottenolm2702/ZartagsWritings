import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../pages/Home";

const navigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock("../context/JWTAuthContext", () => ({
  useJWTAuth: () => ({ isLoggedIn: true }),
}));

const apiFetch = vi.fn();

vi.mock("../lib/api", () => ({
  apiFetch: (...args: unknown[]) => apiFetch(...args),
}));

describe("Home page", () => {
  beforeEach(() => {
    navigate.mockClear();
    apiFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads campaigns and navigates after joining", async () => {
    apiFetch.mockResolvedValueOnce([
      {
        id: 1,
        slug: "wald",
        name: "Wald",
        description: "A campaign",
        role: "DM",
      },
    ]);
    apiFetch.mockResolvedValueOnce({
      campaign: { slug: "wald" },
    });

    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Home />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Wald")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /join campaign/i }));
    fireEvent.change(screen.getByLabelText(/join code/i), {
      target: { value: "abc123" },
    });
    fireEvent.submit(
      screen.getByRole("button", { name: /^join$/i }).closest("form")!,
    );

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith(
        "/api/campaigns/join",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ joinCode: "abc123" }),
        }),
      );
      expect(navigate).toHaveBeenCalledWith("/campaigns/wald/overview");
    });
  });
});
