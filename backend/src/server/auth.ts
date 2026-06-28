import jwt from "jsonwebtoken";
import type { NextFunction, Response } from "express";
import type { AuthRequest } from "./types.js";
import { JWT_SECRET } from "./config.js";

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Bitte melden Sie sich an" });
  }

  jwt.verify(token, JWT_SECRET!, (err: Error | null, decoded: unknown) => {
    if (err) {
      return res.status(403).json({ error: "Ungültiger Token" });
    }

    req.user = decoded as { id: number; email: string };
    next();
  });
}
