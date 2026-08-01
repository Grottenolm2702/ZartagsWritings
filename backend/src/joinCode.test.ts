import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

vi.mock("./server/config.js", () => {
  const campaignCreateMock = vi.fn();
  const userFindUniqueMock = vi
    .fn()
    .mockResolvedValue({ id: 1, email: "test@example.com", name: "Test User" });
  const txMock = {
    campaign: { create: campaignCreateMock },
    user: { findUnique: userFindUniqueMock },
  };
  const prisma = { $transaction: vi.fn(async (cb: any) => cb(txMock)) };
  return {
    prisma,
    JWT_SECRET: "test-secret",
    __mocks: { campaignCreateMock, userFindUniqueMock, txMock, prisma },
  };
});

// Import after mocking
import { registerCampaignRoutes } from "./server/routes/campaignRoutes.js";
import { createJoinCode } from "./server/utils.js";
import * as config from "./server/config.js";

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
    const campaignCreateMock = (config as any).__mocks.campaignCreateMock;
    campaignCreateMock
      .mockImplementationOnce(() => {
        throw new Error("Unique constraint failed: joinCode");
      })
      .mockResolvedValueOnce({
        id: 123,
        slug: "test-campaign",
        name: "TestCampaign",
      });

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
