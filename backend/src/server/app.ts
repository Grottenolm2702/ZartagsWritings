import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOrigins } from "./config.js";
import { registerAuthRoutes } from "./routes/authRoutes.js";
import { registerUserRoutes } from "./routes/userRoutes.js";
import { registerCampaignRoutes } from "./routes/campaignRoutes.js";
import { registerEntityRoutes } from "./routes/entityRoutes.js";
import { registerMemberRoutes } from "./routes/memberRoutes.js";
import { registerHealthRoutes } from "./routes/healthRoutes.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(cookieParser());

  registerAuthRoutes(app);
  registerUserRoutes(app);
  registerCampaignRoutes(app);
  registerEntityRoutes(app);
  registerMemberRoutes(app);
  registerHealthRoutes(app);

  return app;
}
