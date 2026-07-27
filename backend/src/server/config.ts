import dotenv from "dotenv";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/client.js";

dotenv.config();

const portValue = Number(process.env.PORT);
export const PORT = Number.isInteger(portValue) && portValue > 0 ? portValue : 3000;

export const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const jwtSecret = process.env.JWT_SECRET?.trim();
if (!jwtSecret) {
  throw new Error("JWT_SECRET ist nicht gesetzt");
}
if (jwtSecret === "dev-secret-change-me") {
  throw new Error("JWT_SECRET darf nicht auf dem unsicheren Default-Wert stehen");
}
export const JWT_SECRET = jwtSecret;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL ist nicht gesetzt");
}

const adapter = new PrismaBetterSqlite3({
  url: databaseUrl,
});

export const prisma = new PrismaClient({
  adapter,
});
