// backend/src/server.ts
import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
// Unsere erste Test-Route
app.get("/api/health", (_req: Request, res: Response) => {
res.json({ ok: true, message: "Hallo vom eigenen Backend!" });
});
app.listen(PORT, () => {
console.log(`Backend Server laeuft auf http://localhost:${PORT}`);
});