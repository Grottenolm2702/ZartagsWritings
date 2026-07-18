import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

// Mocks for prisma and JWT secret used by the routes
const campaignCreateMock = vi.fn();
const userFindUniqueMock = vi.fn().mockResolvedValue({ id: 1, email: "test@example.com", name: "Test User" });

const txMock = {
  campaign: { create: campaignCreateMock },
  user: { findUnique: userFindUniqueMock },
};

const prismaMock = {
  $transaction: vi.fn(async (cb: any) => cb(txMock)),
};

vi.mock("../config.js", () => ({ prisma: prismaMock, JWT_SECRET: "test-secret" }));

// Import after mocking
import { registerCampaignRoutes } from "./server/routes/campaignRoutes.js";
import { createJoinCode } from "./server/utils.js";

describe("Join code utilities", () => {
  it("createJoinCode produces codes of expected length and alphabet", () => {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    for (let i = 0; i < 200; i += 1) {
      const code = createJoinCode();
      expect(code).toHaveLength(10);
      for (const ch of code) {
        expect(alphabet).toContain(ch);
      }
    }
  });
});

describe("Campaign creation retry behavior", () => {
  it("retries on joinCode unique constraint and succeeds", async () => {
    // First call throws unique constraint, second resolves
    campaignCreateMock.mockImplementationOnce(() => {
      throw new Error("Unique constraint failed: joinCode");
    }).mockResolvedValueOnce({ id: 123, slug: "test-campaign", name: "TestCampaign" });

    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    registerCampaignRoutes(app);

    const token = jwt.sign({ id: 1, email: "test@example.com" }, "test-secret");

    const res = await request(app)
      .post("/api/campaigns")
      .set("Cookie", `token=${token}`)
      .send({ name: "TestCampaign" });

    expect(res.status).toBe(201);
    expect(res.body.id).toBe(123);
    expect(campaignCreateMock).toHaveBeenCalledTimes(2);
  });
});
