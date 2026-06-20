// backend/src/server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./generated/client.js";
import type { Request, Response, NextFunction } from "express";

dotenv.config();

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL ist nicht gesetzt");
}

const adapter = new PrismaBetterSqlite3({
  url: databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

app.post("/api/register", async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

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
    res.json({ mossa: "Login erfolgreich", token });
  } catch (error) {
    res.status(500).json({ error: "Fehler bei der Anmeldung" });
  }
});

// Middleware zum Schutz von Routen
const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token fehlt" });
  }

  jwt.verify(token, JWT_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Ungültiger Token" });
    }

    req.user = decoded as { id: number; email: string };
    next();
  });
};

app.delete(
  "/api/user",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID nicht im Token gefunden" });
    }

    try {
      await prisma.user.delete({ where: { id: userId } });
      res.json({ message: "Benutzer erfolgreich gelöscht" });
    } catch (error) {
      res.status(500).json({ error: "Fehler beim Löschen des Benutzers" });
    }
  },
);

app.get(
  "/api/user",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID nicht im Token gefunden" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true },
      });
      if (!user) {
        return res.status(404).json({ error: "Benutzer nicht gefunden" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Fehler beim Abrufen des Benutzers" });
    }
  },
);

// Unsere erste Test-Route
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, message: "Hallo vom eigenen Backend!" });
});

app.listen(PORT, () => {
  console.log(`Backend Server laeuft auf http://localhost:${PORT}`);
});
