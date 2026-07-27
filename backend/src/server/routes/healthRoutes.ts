import type { Express, Request, Response } from "express";

export function registerHealthRoutes(app: Express) {
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      ok: true,
      message: "Hallo vom eigenen Backend!",
      version: process.env.npm_package_version || "unknown",
      uptimeSeconds: Math.floor(process.uptime()),
    });
  });
}
