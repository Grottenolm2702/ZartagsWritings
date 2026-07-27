import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Express, Request, Response } from "express";
import { prisma, JWT_SECRET } from "../config.js";

const TOKEN_MAX_AGE_MS = 60 * 60 * 1000;

function setAuthCookie(res: Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: TOKEN_MAX_AGE_MS,
  });
}

export function registerAuthRoutes(app: Express) {
  app.post("/api/register", async (req: Request, res: Response) => {
    const { email, name, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "E-Mail und Passwort sind erforderlich" });
    }

    // Password policy: at least one lower, one upper, one digit, only letters+digits, length 8-30
    const passwordRegex = /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d)[\p{L}\d]{8,30}$/u;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Passwort muss 8–30 Zeichen lang sein und mindestens einen Großbuchstaben, einen Kleinbuchstaben und eine Zahl enthalten (nur Buchstaben und Zahlen).",
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      });
      res
        .status(201)
        .json({ message: "Benutzer erfolgreich registriert", userId: user.id });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unbekannter Fehler beim Registrieren";

      if (message.includes("UNIQUE constraint failed: User.email")) {
        return res.status(409).json({ error: "Diese E-Mail ist bereits registriert" });
      }

      res.status(400).json({ error: "User konnte nicht erstellt werden" });
    }
  });

  app.post("/api/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: "Ungültige Anmeldedaten" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Ungültige Anmeldedaten" });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET!, {
        expiresIn: "1h",
      });
      setAuthCookie(res, token);
      res.json({ message: "Login erfolgreich" });
    } catch (error) {
      res.status(500).json({ error: "Fehler bei der Anmeldung" });
    }
  });

  app.post("/api/session/refresh", (req: Request, res: Response) => {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Bitte melden Sie sich an" });
    }

    jwt.verify(token, JWT_SECRET!, (err: Error | null, decoded: unknown) => {
      if (err) {
        res.clearCookie("token", {
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });
        return res.status(401).json({ error: "Bitte melden Sie sich an" });
      }

      const user = decoded as { id: number; email: string };
      const refreshedToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET!, {
        expiresIn: "1h",
      });

      setAuthCookie(res, refreshedToken);
      return res.json({ message: "Session verlängert" });
    });
  });

  app.post("/api/logout", (_req: Request, res: Response) => {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ message: "Logout erfolgreich" });
  });
}
