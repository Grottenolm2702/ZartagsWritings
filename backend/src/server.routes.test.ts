import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  user: {
    create: vi.fn(async () => ({ id: 0 })),
    findUnique: vi.fn(async () => null),
    delete: vi.fn(async () => undefined),
  },
  campaignMember: {
    findMany: vi.fn(async () => []),
    create: vi.fn(async () => undefined),
  },
  campaign: {
    findUnique: vi.fn(async () => null),
    create: vi.fn(async () => ({ id: 0 })),
  },
  $transaction: vi.fn(async (callback: any) => callback({})),
})) as any;

vi.mock("./server/config.js", () => ({
  prisma: prismaMock,
  JWT_SECRET: "test-secret",
  corsOrigins: ["http://localhost:5173"],
  PORT: 3000,
}));

const bcryptMock = vi.hoisted(() => ({
  hash: vi.fn(async () => "hashed-password"),
  compare: vi.fn(async () => true),
})) as any;

vi.mock("bcrypt", () => ({
  default: bcryptMock,
  hash: bcryptMock.hash,
  compare: bcryptMock.compare,
}));

import bcrypt from "bcrypt";
import { createApp } from "./server/app.js";

describe("Server auth routes", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("registriert Benutzer und speichert das gehashte Passwort", async () => {
    prismaMock.user.create.mockResolvedValue({ id: 42 });

    const app = createApp();
    const res = await request(app).post("/api/register").send({
      email: "alice@example.com",
      name: "Alice",
      password: "Secret123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: "Benutzer erfolgreich registriert",
      userId: 42,
    });
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        email: "alice@example.com",
        name: "Alice",
        password: "hashed-password",
      },
    });
  });

  it("lehnt doppelte Registrierung ab", async () => {
    prismaMock.user.create.mockRejectedValue(new Error("UNIQUE constraint failed: User.email"));

    const app = createApp();
    const res = await request(app).post("/api/register").send({
      email: "alice@example.com",
      password: "Secret123",
    });

    expect(res.status).toBe(409);
    expect(res.body).toEqual({ error: "Diese E-Mail ist bereits registriert" });
  });

  it("meldet Benutzer an und setzt ein HttpOnly Cookie", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 7,
      email: "alice@example.com",
      password: "hashed-password",
    });

    const app = createApp();
    const res = await request(app).post("/api/login").send({
      email: "alice@example.com",
      password: "Secret123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Login erfolgreich" });
    expect(res.headers["set-cookie"][0]).toContain("token=");
  });

  it("liefert Benutzer-Daten nur mit gültigem Token", async () => {
    prismaMock.user.findUnique
      .mockResolvedValueOnce({
        id: 7,
        email: "alice@example.com",
        password: "hashed-password",
      })
      .mockResolvedValueOnce({
        id: 7,
        email: "alice@example.com",
        name: "Alice",
        memberships: [
          {
            id: 1,
            role: "DM",
            displayName: "Alice",
            joinedAt: "2026-06-28T00:00:00.000Z",
            campaign: {
              id: 11,
              slug: "wald",
              name: "Wald",
              description: "Eine Kampagne",
            },
          },
        ],
      });

    const app = createApp();
    const loginRes = await request(app).post("/api/login").send({
      email: "alice@example.com",
      password: "Secret123",
    });

    const userRes = await request(app)
      .get("/api/user")
      .set("Cookie", loginRes.headers["set-cookie"]);

    expect(userRes.status).toBe(200);
    expect(userRes.body.email).toBe("alice@example.com");
    expect(userRes.body.memberships).toHaveLength(1);
  });
});
