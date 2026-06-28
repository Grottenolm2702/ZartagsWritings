import dotenv from "dotenv";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/client.js";

dotenv.config();

export const PORT = 3000;

export const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const JWT_SECRET = process.env.JWT_SECRET;

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
