import type { Express, Response } from "express";
import { prisma } from "../config.js";
import { authenticateToken } from "../auth.js";
import type { AuthRequest, ApiEntityType } from "../types.js";
import {
  canEditCampaign,
  ENTITY_TYPE_LABELS,
  loadCampaignForUser,
  serializeEntity,
} from "../entities.js";
import { createJoinCode, createSlug, toSingleValue } from "../utils.js";

export function registerCampaignRoutes(app: Express) {
  app.get("/api/campaigns", authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID nicht im Token gefunden" });
    }

    try {
      const memberships = await prisma.campaignMember.findMany({
        where: { userId },
        include: {
          campaign: {
            include: {
              owner: { select: { id: true, email: true, name: true } },
              _count: {
                select: {
                  members: true,
                  entities: true,
                },
              },
            },
          },
        },
        orderBy: { joinedAt: "desc" },
      });

      res.json(
        memberships.map((membership) => ({
          id: membership.campaign.id,
          slug: membership.campaign.slug,
          name: membership.campaign.name,
          description: membership.campaign.description,
          joinCode: membership.campaign.joinCode,
          role: membership.role,
          displayName: membership.displayName,
          createdAt: membership.campaign.createdAt,
          updatedAt: membership.campaign.updatedAt,
          owner: membership.campaign.owner,
          counts: membership.campaign._count,
        })),
      );
    } catch (error) {
      res.status(500).json({ error: "Fehler beim Laden der Kampagnen" });
    }
  });

  app.post("/api/campaigns", authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { name, description, slug } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID nicht im Token gefunden" });
    }

    const campaignName = String(name ?? "").trim();
    if (!campaignName) {
      return res.status(400).json({ error: "Campaign-Name fehlt" });
    }

    try {
      const created = await prisma.$transaction(async (tx) => {
        const owner = await tx.user.findUnique({
          where: { id: userId },
          select: { id: true, email: true, name: true },
        });

        if (!owner) {
          throw new Error("Benutzer nicht gefunden");
        }

        return tx.campaign.create({
          data: {
            slug: createSlug(slug || campaignName),
            name: campaignName,
            description: description ?? null,
            joinCode: createJoinCode(),
            ownerId: userId,
            members: {
              create: {
                userId,
                role: "DM",
                displayName: owner.name ?? owner.email,
              },
            },
          },
          include: {
            owner: { select: { id: true, email: true, name: true } },
            members: {
              include: {
                user: { select: { id: true, email: true, name: true } },
              },
            },
          },
        });
      });

      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({
        error:
          error instanceof Error ? error.message : "Campaign konnte nicht erstellt werden",
      });
    }
  });

  app.post(
    "/api/campaigns/join",
    authenticateToken,
    async (req: AuthRequest, res: Response) => {
      const userId = req.user?.id;
      const { joinCode } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID nicht im Token gefunden" });
      }

      const code = String(joinCode ?? "").trim().toUpperCase();
      if (!code) {
        return res.status(400).json({ error: "Join-Code fehlt" });
      }

      try {
        const campaign = await prisma.campaign.findUnique({
          where: { joinCode: code },
          include: {
            members: true,
            owner: { select: { id: true, email: true, name: true } },
          },
        });

        if (!campaign) {
          return res.status(404).json({ error: "Campaign nicht gefunden" });
        }

        const existing = campaign.members.find((member) => member.userId === userId);
        if (existing) {
          return res.status(409).json({ error: "Bereits in der Campaign" });
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, email: true, name: true },
        });

        if (!user) {
          return res.status(404).json({ error: "Benutzer nicht gefunden" });
        }

        await prisma.campaignMember.create({
          data: {
            campaignId: campaign.id,
            userId,
            role: "PLAYER",
            displayName: user.name ?? user.email,
          },
        });

        res.status(201).json({
          message: "Campaign beigetreten",
          campaign: {
            id: campaign.id,
            slug: campaign.slug,
            name: campaign.name,
          },
        });
      } catch (error) {
        res.status(500).json({ error: "Fehler beim Beitritt zur Campaign" });
      }
    },
  );

  app.get("/api/campaigns/:slug", authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const slug = toSingleValue(req.params.slug);

    if (!userId) {
      return res.status(400).json({ error: "User ID nicht im Token gefunden" });
    }

    const access = await loadCampaignForUser(userId, slug);
    if (!access.campaign) {
      return res.status(404).json({ error: "Campaign nicht gefunden" });
    }
    if (!access.membership && access.campaign.ownerId !== userId) {
      return res.status(403).json({ error: "Kein Zugriff auf diese Campaign" });
    }

    res.json({
      id: access.campaign.id,
      slug: access.campaign.slug,
      name: access.campaign.name,
      description: access.campaign.description,
      joinCode: access.campaign.joinCode,
      createdAt: access.campaign.createdAt,
      updatedAt: access.campaign.updatedAt,
      owner: access.campaign.owner,
      members: access.campaign.members.map((member) => ({
        id: member.id,
        userId: member.userId,
        role: member.role,
        displayName: member.displayName,
        joinedAt: member.joinedAt,
        user: member.user,
      })),
      entities: access.campaign.entities.map((entity) => serializeEntity(entity)),
    });
  });

  app.get("/api/campaigns/:slug/overview", authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const slug = toSingleValue(req.params.slug);

    if (!userId) {
      return res.status(400).json({ error: "User ID nicht im Token gefunden" });
    }

    const access = await loadCampaignForUser(userId, slug);
    if (!access.campaign) {
      return res.status(404).json({ error: "Campaign nicht gefunden" });
    }
    if (!access.membership && access.campaign.ownerId !== userId) {
      return res.status(403).json({ error: "Kein Zugriff auf diese Campaign" });
    }

    const grouped = {
      pc: access.campaign.entities.filter((entity) => entity.type === "PC"),
      npc: access.campaign.entities.filter((entity) => entity.type === "NPC"),
      magicitem: access.campaign.entities.filter((entity) => entity.type === "MAGIC_ITEM"),
      location: access.campaign.entities.filter((entity) => entity.type === "LOCATION"),
    };

    res.json({
      title: access.campaign.name,
      sections: (Object.keys(grouped) as ApiEntityType[]).map((key) => ({
        category: key,
        title: ENTITY_TYPE_LABELS[key],
        items: grouped[key].map((entity) => ({
          label: entity.name,
          href: `/api/campaigns/${slug}/${key}/${entity.slug}`,
        })),
      })),
    });
  });
}
