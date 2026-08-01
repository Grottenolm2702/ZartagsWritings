import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import React from "react";
import { JWTAuthProvider, useJWTAuth } from "../context/JWTAuthContext";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

describe("JWTAuthContext - Login Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve(""),
          json: () => Promise.resolve({}),
        }),
      ),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("login() macht POST request zu /api/login endpoint mit Credentials", async () => {
    function LoginComponent() {
      const { login } = useJWTAuth();
      return (
        <button onClick={() => login("user@test.com", "pass123")}>Login</button>
      );
    }

    render(
      <JWTAuthProvider>
        <LoginComponent />
      </JWTAuthProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/login",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }),
      );
    });
  });

  it("logout() macht POST request zu /api/logout endpoint", async () => {
    function LogoutComponent() {
      const { logout } = useJWTAuth();
      return <button onClick={() => logout()}>Logout</button>;
    }

    render(
      <JWTAuthProvider>
        <LogoutComponent />
      </JWTAuthProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/logout",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        }),
      );
    });
  });

  it("verarbeitet erfolgreiche Login Response mit HttpOnly Cookie", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(""),
      headers: {
        "set-cookie": "token=abc123; HttpOnly; Secure; SameSite=Strict",
      },
    } as any);

    function LoginComponent() {
      const { login } = useJWTAuth();
      return (
        <button onClick={() => login("user@test.com", "pass123")}>Login</button>
      );
    }

    render(
      <JWTAuthProvider>
        <LoginComponent />
      </JWTAuthProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  it("verlängert die Session bei Aktivität nach ausreichender Zeit", async () => {
    let loggedIn = false;
    let currentTime = 0;
    vi.spyOn(Date, "now").mockImplementation(() => currentTime);
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url === "/api/user") {
        if (!loggedIn) {
          return {
            ok: false,
            text: () => Promise.resolve('{"error":"Bitte melden Sie sich an"}'),
            json: () => Promise.resolve({}),
          };
        }

        return {
          ok: true,
          text: () => Promise.resolve(""),
          json: () => Promise.resolve({ id: 1, email: "user@test.com" }),
        };
      }

      if (url === "/api/login") {
        loggedIn = true;
        return {
          ok: true,
          text: () => Promise.resolve(""),
          json: () => Promise.resolve({ message: "Login erfolgreich" }),
        };
      }

      if (url === "/api/session/refresh") {
        return {
          ok: true,
          text: () => Promise.resolve(""),
          json: () => Promise.resolve({ message: "Session verlängert" }),
        };
      }

      return {
        ok: true,
        text: () => Promise.resolve(""),
        json: () => Promise.resolve({}),
      };
    });

    vi.stubGlobal("fetch", fetchMock);

    function LoginComponent() {
      const { login } = useJWTAuth();
      return (
        <button onClick={() => login("user@test.com", "pass123")}>Login</button>
      );
    }

    render(
      <JWTAuthProvider>
        <LoginComponent />
      </JWTAuthProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/login",
        expect.objectContaining({ method: "POST", credentials: "include" }),
      );
    });

    await act(async () => {
      await Promise.resolve();
    });

    currentTime = 16 * 60 * 1000;
    act(() => {
      window.dispatchEvent(new Event("pointerdown"));
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/session/refresh",
        expect.objectContaining({ method: "POST", credentials: "include" }),
      );
    });
  });
});
