import type { Express, Response } from "express";
import { prisma } from "../config.js";
import { authenticateToken } from "../auth.js";
import type { AuthRequest } from "../types.js";

export function registerUserRoutes(app: Express) {
  app.get("/api/user", authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID nicht im Token gefunden" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          memberships: {
            include: {
              campaign: {
                select: {
                  id: true,
                  slug: true,
                  name: true,
                  description: true,
                },
              },
            },
          },
        },
      });
      if (!user) {
        return res.status(404).json({ error: "Benutzer nicht gefunden" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Fehler beim Abrufen des Benutzers" });
    }
  });

  app.delete("/api/user", authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID nicht im Token gefunden" });
    }

    try {
      await prisma.user.delete({ where: { id: userId } });
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
      res.json({ message: "Benutzer erfolgreich gelöscht" });
    } catch (error) {
      res.status(500).json({ error: "Fehler beim Löschen des Benutzers" });
    }
  });
}
