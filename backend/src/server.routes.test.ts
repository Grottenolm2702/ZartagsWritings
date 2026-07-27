import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";

const prismaMock = vi.hoisted(() => ({
  user: {
    create: vi.fn(async () => ({ id: 0 })),
    findUnique: vi.fn(async () => null),
    delete: vi.fn(async () => undefined),
  },
  campaignMember: {
    findMany: vi.fn(async () => []),
    create: vi.fn(async () => undefined),
    findUnique: vi.fn(async () => null),
    update: vi.fn(async () => null),
  },
  campaign: {
    findUnique: vi.fn(async () => null),
    create: vi.fn(async () => ({ id: 0 })),
    update: vi.fn(async () => null),
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

function buildCampaignForMembership(role: "DM" | "EDITOR" | "PLAYER") {
  return {
    id: 11,
    ownerId: 99,
    slug: "wald",
    name: "Wald",
    description: "Eine Kampagne",
    joinCode: "JOIN123456",
    createdAt: "2026-06-28T00:00:00.000Z",
    updatedAt: "2026-06-28T00:00:00.000Z",
    owner: {
      id: 99,
      email: "owner@example.com",
      name: "Owner",
    },
    members: [
      {
        id: 1,
        campaignId: 11,
        userId: 7,
        role,
        displayName: "Current User",
        joinedAt: "2026-06-28T00:00:00.000Z",
        user: { id: 7, email: "user@example.com", name: "Current User" },
      },
    ],
    entities: [],
  };
}

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

  describe("Campaign manage permissions", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("verbietet Editor das Regenerieren des Join-Codes", async () => {
      prismaMock.campaign.findUnique.mockResolvedValue(buildCampaignForMembership("EDITOR"));

      const app = createApp();
      const token = jwt.sign({ id: 7, email: "editor@example.com" }, "test-secret");
      const res = await request(app)
        .post("/api/campaigns/wald/regenerate-join-code")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
      expect(prismaMock.campaign.update).not.toHaveBeenCalled();
    });

    it("erlaubt DM das Regenerieren des Join-Codes", async () => {
      prismaMock.campaign.findUnique.mockResolvedValue(buildCampaignForMembership("DM"));
      prismaMock.campaign.update.mockResolvedValue({ joinCode: "NEWCODE2345" });

      const app = createApp();
      const token = jwt.sign({ id: 7, email: "dm@example.com" }, "test-secret");
      const res = await request(app)
        .post("/api/campaigns/wald/regenerate-join-code")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ joinCode: "NEWCODE2345" });
    });

    it("verbietet Editor das Ändern von Member-Rollen", async () => {
      prismaMock.campaign.findUnique.mockResolvedValue(buildCampaignForMembership("EDITOR"));

      const app = createApp();
      const token = jwt.sign({ id: 7, email: "editor@example.com" }, "test-secret");
      const res = await request(app)
        .patch("/api/campaigns/wald/members/9")
        .set("Cookie", `token=${token}`)
        .send({ role: "DM" });

      expect(res.status).toBe(403);
      expect(prismaMock.campaignMember.update).not.toHaveBeenCalled();
    });

    it("erlaubt DM das Ändern von Member-Rollen", async () => {
      prismaMock.campaign.findUnique.mockResolvedValue(buildCampaignForMembership("DM"));
      prismaMock.campaignMember.findUnique.mockResolvedValue({
        id: 20,
        campaignId: 11,
        userId: 9,
        role: "PLAYER",
        displayName: "Target User",
      });
      prismaMock.campaignMember.update.mockResolvedValue({
        id: 20,
        campaignId: 11,
        userId: 9,
        role: "DM",
        displayName: "Target User",
      });

      const app = createApp();
      const token = jwt.sign({ id: 7, email: "dm@example.com" }, "test-secret");
      const res = await request(app)
        .patch("/api/campaigns/wald/members/9")
        .set("Cookie", `token=${token}`)
        .send({ role: "DM" });

      expect(res.status).toBe(200);
      expect(res.body.role).toBe("DM");
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

  it("verlängert die Session bei aktivem gültigem Token", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 7,
      email: "alice@example.com",
      password: "hashed-password",
    });

    const app = createApp();
    const loginRes = await request(app).post("/api/login").send({
      email: "alice@example.com",
      password: "Secret123",
    });

    const refreshRes = await request(app)
      .post("/api/session/refresh")
      .set("Cookie", loginRes.headers["set-cookie"]);

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body).toEqual({ message: "Session verlängert" });
    expect(refreshRes.headers["set-cookie"][0]).toContain("token=");
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

  it("gibt 401 zurück, wenn /api/user ohne Token aufgerufen wird", async () => {
    const app = createApp();
    const res = await request(app).get("/api/user");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Bitte melden Sie sich an" });
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });

  it("gibt 403 zurück, wenn /api/user mit ungültigem Token aufgerufen wird", async () => {
    const app = createApp();
    const res = await request(app)
      .get("/api/user")
      .set("Cookie", "token=invalid.token.value");

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: "Ungültiger Token" });
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });

  it("logout löscht das Auth-Cookie", async () => {
    const app = createApp();
    const res = await request(app).post("/api/logout");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Logout erfolgreich" });
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.headers["set-cookie"][0]).toContain("token=;");
  });
});
