import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";

vi.mock("./server/config.js", () => {
  const createMock = vi.fn();
  const prisma = { user: { create: createMock } } as any;
  return { prisma, JWT_SECRET: "test-secret", __mocks: { createMock } };
});

// import after mocking
import { registerAuthRoutes } from "./server/routes/authRoutes.js";
import * as config from "./server/config.js";

describe("Registration route", () => {
  beforeEach(() => {
    const createMock = (config as any).__mocks.createMock;
    createMock.mockReset();
  });

  it("rejects weak password", async () => {
    const app = express();
    app.use(express.json());
    registerAuthRoutes(app);

    const res = await request(app).post("/api/register").send({
      email: "weak@example.com",
      name: "Weak",
      password: "weakpass",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Passwort/);
  });

  it("accepts strong password and creates user", async () => {
    const createMock = (config as any).__mocks.createMock;
    createMock.mockResolvedValueOnce({ id: 42 });

    const app = express();
    app.use(express.json());
    registerAuthRoutes(app);

    const res = await request(app).post("/api/register").send({
      email: "good@example.com",
      name: "Good User",
      password: "GoodPass1",
    });

    expect(res.status).toBe(201);
    expect(res.body.userId).toBe(42);
    expect(createMock).toHaveBeenCalledTimes(1);
  });

  it("accepts strong password with umlauts and creates user", async () => {
    const createMock = (config as any).__mocks.createMock;
    createMock.mockResolvedValueOnce({ id: 43 });

    const app = express();
    app.use(express.json());
    registerAuthRoutes(app);

    const res = await request(app).post("/api/register").send({
      email: "umlaut@example.com",
      name: "Umlaut User",
      password: "123Nüsse",
    });

    expect(res.status).toBe(201);
    expect(res.body.userId).toBe(43);
    expect(createMock).toHaveBeenCalledTimes(1);
  });

  it("returns 409 for duplicate email", async () => {
    const createMock = (config as any).__mocks.createMock;
    createMock.mockRejectedValueOnce(
      new Error("UNIQUE constraint failed: User.email"),
    );

    const app = express();
    app.use(express.json());
    registerAuthRoutes(app);

    const res = await request(app).post("/api/register").send({
      email: "dup@example.com",
      name: "Dup",
      password: "GoodPass1",
    });

    expect(res.status).toBe(409);
  });
});
