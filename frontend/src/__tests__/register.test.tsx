import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../pages/Register";
import { JWTAuthProvider, useJWTAuth } from "../context/JWTAuthContext";
import { MemoryRouter } from "react-router-dom";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("Register page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("blocks weak passwords on client-side and shows error", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock as any);

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <JWTAuthProvider>
          <Register />
        </JWTAuthProvider>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/Name:/i), { target: { value: "Weak" } });
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: "weak@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password:/i), { target: { value: "weakpass" } });
    fireEvent.change(screen.getByLabelText(/Repeat password:/i), { target: { value: "weakpass" } });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    // Ensure some rules are not satisfied (weak password)
    await waitFor(() => {
      const checks = screen.queryAllByText("✓");
      expect(checks.length).toBeLessThan(4);
    });

    // Ensure register endpoint was not called (ignore other initial calls like /api/user)
    const registerCalls = (fetchMock as any).mock.calls.filter((c: any[]) => c[0] === "/api/register");
    expect(registerCalls.length).toBe(0);
  });

  it("register() in context calls the register endpoint for a strong password", async () => {
    // stub fetch to respond OK for registration
    const fetchMock = vi.fn((url: string) => {
      if (url === "/api/register") {
        return Promise.resolve({ ok: true, text: () => Promise.resolve("") } as any);
      }
      return Promise.resolve({ ok: true, text: () => Promise.resolve("") } as any);
    });
    vi.stubGlobal("fetch", fetchMock as any);

    function Caller() {
      const { register } = useJWTAuth();
      return <button onClick={() => register("Good", "good@example.com", "GoodPass1")}>Call</button>;
    }

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <JWTAuthProvider>
          <Caller />
        </JWTAuthProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /call/i }));

    await waitFor(() => {
      const calls = (fetch as any).mock.calls.map((c: any[]) => c[0]);
      expect(calls).toContain("/api/register");
      expect(fetch).toHaveBeenCalledWith(
        "/api/register",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });

  it("allows unicode letters in strong passwords on client-side", async () => {
    const fetchMock = vi.fn((url: string) => {
      if (url === "/api/register") {
        return Promise.resolve({ ok: true, text: () => Promise.resolve("") } as any);
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) } as any);
    });
    vi.stubGlobal("fetch", fetchMock as any);

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <JWTAuthProvider>
          <Register />
        </JWTAuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      const button = screen.getByRole("button", { name: /register/i }) as HTMLButtonElement;
      expect(button.disabled).toBe(false);
    });

    fireEvent.change(screen.getByLabelText(/Name:/i), { target: { value: "Umlaut" } });
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: "umlaut@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password:/i), { target: { value: "123Nüsse" } });
    fireEvent.change(screen.getByLabelText(/Repeat password:/i), { target: { value: "123Nüsse" } });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      const registerCalls = (fetch as any).mock.calls.filter((c: any[]) => c[0] === "/api/register");
      expect(registerCalls.length).toBe(1);
    });
  });
});
