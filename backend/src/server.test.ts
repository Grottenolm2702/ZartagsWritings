import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import express, { Express, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

interface AuthRequest extends express.Request {
  user?: { id: number; email: string };
}

const JWT_SECRET = "test-secret-key";
const app = express();

app.use(express.json());
app.use(cookieParser());

const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Bitte melden Sie sich an" });
  }

  jwt.verify(
    token,
    JWT_SECRET,
    (err: Error | null, decoded: unknown) => {
      if (err) {
        return res.status(403).json({ error: "Ungültiger Token" });
      }

      req.user = decoded as { id: number; email: string };
      next();
    },
  );
};

app.post("/api/login", (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  if (email === "test@example.com" && password === "password123") {
    const token = jwt.sign(
      { id: 1, email: "test@example.com" },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });

    return res.json({ message: "Login erfolgreich" });
  }

  res.status(401).json({ error: "Email oder Passwort falsch" });
});

app.get("/api/user", authenticateToken, (req: AuthRequest, res: Response) => {
  res.json({ id: req.user?.id, email: req.user?.email });
});

describe("Auth API Tests", () => {
  describe("POST /api/login", () => {
    it("erfolgreiche Anmeldung mit korrekten Credentials", async () => {
      const res = await request(app).post("/api/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Login erfolgreich");
      expect(res.headers["set-cookie"]).toBeDefined();
      expect(res.headers["set-cookie"][0]).toContain("token=");
    });

    it("Login mit falschemem Passwort schlägt fehl", async () => {
      const res = await request(app).post("/api/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Email oder Passwort falsch");
    });
  });

  describe("GET /api/user", () => {
    it("GET /api/user ohne Token gibt 401 zurück", async () => {
      const res = await request(app).get("/api/user");

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Bitte melden Sie sich an");
    });

    it("GET /api/user mit Token gibt User-Daten zurück", async () => {
      const loginRes = await request(app).post("/api/login").send({
        email: "test@example.com",
        password: "password123",
      });

      const cookies = loginRes.headers["set-cookie"];

      const userRes = await request(app)
        .get("/api/user")
        .set("Cookie", cookies);

      expect(userRes.status).toBe(200);
      expect(userRes.body.id).toBe(1);
      expect(userRes.body.email).toBe("test@example.com");
    });
  });
});
