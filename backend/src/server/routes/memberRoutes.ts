import type { Express, Response } from "express";
import { prisma } from "../config.js";
import { authenticateToken } from "../auth.js";
import type { AuthRequest } from "../types.js";
import { canManageCampaign, loadCampaignForUser } from "../entities.js";
import { toSingleValue } from "../utils.js";

export function registerMemberRoutes(app: Express) {
  app.patch(
    "/api/campaigns/:slug/members/:memberUserId",
    authenticateToken,
    async (req: AuthRequest, res: Response) => {
      const userId = req.user?.id;
      const slug = toSingleValue(req.params.slug);
      const memberUserId = toSingleValue(req.params.memberUserId);
      const { role, displayName } = req.body as {
        role?: "DM" | "EDITOR" | "PLAYER";
        displayName?: string | null;
      };

      if (!userId) {
        return res
          .status(400)
          .json({ error: "User ID nicht im Token gefunden" });
      }

      const access = await loadCampaignForUser(userId, slug);
      if (!access.campaign) {
        return res.status(404).json({ error: "Campaign nicht gefunden" });
      }
      if (
        !canManageCampaign(
          access.campaign.ownerId,
          access.membership?.role,
          userId,
        )
      ) {
        return res
          .status(403)
          .json({ error: "Keine Berechtigung zum Bearbeiten" });
      }

      const member = await prisma.campaignMember.findUnique({
        where: {
          campaignId_userId: {
            campaignId: access.campaign.id,
            userId: Number(memberUserId),
          },
        },
      });

      if (!member) {
        return res.status(404).json({ error: "Mitglied nicht gefunden" });
      }

      const updated = await prisma.campaignMember.update({
        where: { id: member.id },
        data: {
          role: role ?? member.role,
          displayName: displayName ?? member.displayName,
        },
      });

      res.json(updated);
    },
  );
}
