import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiFetch } from "../lib/api";

describe("apiFetch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("setzt credentials=include und Content-Type bei JSON-Body", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    const result = await apiFetch<{ ok: boolean }>("/api/test", {
      method: "POST",
      body: JSON.stringify({ hello: "world" }),
    });

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({
        credentials: "include",
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("wirft die JSON-Fehlermeldung aus error-Property", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => JSON.stringify({ error: "Join-Code fehlt" }),
    });
    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    await expect(apiFetch("/api/campaigns/join")).rejects.toThrow(
      "Join-Code fehlt",
    );
  });

  it("fällt auf Raw-Text zurück, wenn keine JSON-Fehlermeldung vorhanden ist", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });
    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    await expect(apiFetch("/api/fail")).rejects.toThrow(
      "Internal Server Error",
    );
  });
});
