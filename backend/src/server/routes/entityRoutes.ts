import type { Express, Response } from "express";
import { prisma } from "../config.js";
import { authenticateToken } from "../auth.js";
import type { AuthRequest, ApiEntityPayload, ApiEntityType } from "../types.js";
import {
  canEditCampaign,
  ENTITY_TEMPLATES,
  loadCampaignForUser,
  mapCardToBlock,
  serializeEntity,
} from "../entities.js";
import {
  createSlug,
  entityTypeToApi,
  getEntityType,
  toSingleValue,
} from "../utils.js";

export function registerEntityRoutes(app: Express) {
  app.get(
    "/api/campaigns/:slug/entities/:type/template",
    authenticateToken,
    async (req: AuthRequest, res: Response) => {
      const userId = req.user?.id;
      const slug = toSingleValue(req.params.slug);
      const type = toSingleValue(req.params.type);
      const entityType = getEntityType(type);

      if (!userId) {
        return res
          .status(400)
          .json({ error: "User ID nicht im Token gefunden" });
      }
      if (!entityType) {
        return res.status(400).json({ error: "Ungültiger Entity-Typ" });
      }

      const access = await loadCampaignForUser(userId, slug);
      if (!access.campaign) {
        return res.status(404).json({ error: "Campaign nicht gefunden" });
      }
      if (!access.membership && access.campaign.ownerId !== userId) {
        return res
          .status(403)
          .json({ error: "Kein Zugriff auf diese Campaign" });
      }

      res.json({
        type: entityTypeToApi(entityType),
        ...ENTITY_TEMPLATES[entityTypeToApi(entityType)],
      });
    },
  );

  app.get(
    "/api/campaigns/:slug/entities/:type",
    authenticateToken,
    async (req: AuthRequest, res: Response) => {
      const userId = req.user?.id;
      const slug = toSingleValue(req.params.slug);
      const type = toSingleValue(req.params.type);
      const apiType = type.toLowerCase() as ApiEntityType;
      const entityType = getEntityType(apiType);

      if (!userId) {
        return res
          .status(400)
          .json({ error: "User ID nicht im Token gefunden" });
      }
      if (!entityType) {
        return res.status(400).json({ error: "Ungültiger Entity-Typ" });
      }

      const access = await loadCampaignForUser(userId, slug);
      if (!access.campaign) {
        return res.status(404).json({ error: "Campaign nicht gefunden" });
      }
      if (!access.membership && access.campaign.ownerId !== userId) {
        return res
          .status(403)
          .json({ error: "Kein Zugriff auf diese Campaign" });
      }

      const entities = access.campaign.entities.filter(
        (entity) => entity.type === entityType,
      );
      res.json(entities.map((entity) => serializeEntity(entity)));
    },
  );

  app.get(
    "/api/campaigns/:slug/entities/:type/:entitySlug",
    authenticateToken,
    async (req: AuthRequest, res: Response) => {
      const userId = req.user?.id;
      const slug = toSingleValue(req.params.slug);
      const type = toSingleValue(req.params.type);
      const entitySlug = toSingleValue(req.params.entitySlug);
      const apiType = type.toLowerCase() as ApiEntityType;
      const entityType = getEntityType(apiType);

      if (!userId) {
        return res
          .status(400)
          .json({ error: "User ID nicht im Token gefunden" });
      }
      if (!entityType) {
        return res.status(400).json({ error: "Ungültiger Entity-Typ" });
      }

      const access = await loadCampaignForUser(userId, slug);
      if (!access.campaign) {
        return res.status(404).json({ error: "Campaign nicht gefunden" });
      }
      if (!access.membership && access.campaign.ownerId !== userId) {
        return res
          .status(403)
          .json({ error: "Kein Zugriff auf diese Campaign" });
      }

      const entity = access.campaign.entities.find(
        (entry) => entry.type === entityType && entry.slug === entitySlug,
      );

      if (!entity) {
        return res.status(404).json({ error: "Entity nicht gefunden" });
      }

      res.json(serializeEntity(entity));
    },
  );

  app.post(
    "/api/campaigns/:slug/entities/:type",
    authenticateToken,
    async (req: AuthRequest, res: Response) => {
      const userId = req.user?.id;
      const slug = toSingleValue(req.params.slug);
      const type = toSingleValue(req.params.type);
      const apiType = type.toLowerCase() as ApiEntityType;
      const entityType = getEntityType(apiType);
      const payload = req.body as ApiEntityPayload;

      if (!userId) {
        return res
          .status(400)
          .json({ error: "User ID nicht im Token gefunden" });
      }
      if (!entityType) {
        return res.status(400).json({ error: "Ungültiger Entity-Typ" });
      }

      const access = await loadCampaignForUser(userId, slug);
      if (!access.campaign) {
        return res.status(404).json({ error: "Campaign nicht gefunden" });
      }
      if (
        !canEditCampaign(
          access.campaign.ownerId,
          access.membership?.role,
          userId,
        )
      ) {
        return res
          .status(403)
          .json({ error: "Keine Berechtigung zum Bearbeiten" });
      }

      const entitySlug = createSlug(payload.slug || payload.name);
      if (!entitySlug) {
        return res.status(400).json({ error: "Entity-Slug fehlt" });
      }

      try {
        const created = await prisma.entity.create({
          data: {
            campaignId: access.campaign.id,
            creatorId: userId,
            type: entityType,
            slug: entitySlug,
            name: payload.name,
            summary: payload.summary ?? null,
            isVisible: payload.isVisible ?? true,
            sortOrder: payload.sortOrder ?? 0,
            fields: payload.headerFields?.length
              ? {
                  create: payload.headerFields.map((field, index) => ({
                    label: field.label,
                    value: field.value,
                    sortOrder: index,
                  })),
                }
              : undefined,
            blocks: payload.cards?.length
              ? {
                  create: payload.cards.map((card, index) =>
                    mapCardToBlock(card, index),
                  ),
                }
              : undefined,
          },
          include: {
            fields: { orderBy: { sortOrder: "asc" } },
            blocks: {
              orderBy: { sortOrder: "asc" },
              include: {
                listItems: { orderBy: { sortOrder: "asc" } },
                attributes: { orderBy: { sortOrder: "asc" } },
              },
            },
          },
        });

        res.status(201).json(serializeEntity(created));
      } catch (error) {
        res.status(400).json({
          error:
            error instanceof Error
              ? error.message
              : "Entity konnte nicht erstellt werden",
        });
      }
    },
  );

  app.put(
    "/api/campaigns/:slug/entities/:type/:entitySlug",
    authenticateToken,
    async (req: AuthRequest, res: Response) => {
      const userId = req.user?.id;
      const slug = toSingleValue(req.params.slug);
      const type = toSingleValue(req.params.type);
      const entitySlug = toSingleValue(req.params.entitySlug);
      const apiType = type.toLowerCase() as ApiEntityType;
      const entityType = getEntityType(apiType);
      const payload = req.body as ApiEntityPayload;

      if (!userId) {
        return res
          .status(400)
          .json({ error: "User ID nicht im Token gefunden" });
      }
      if (!entityType) {
        return res.status(400).json({ error: "Ungültiger Entity-Typ" });
      }

      const access = await loadCampaignForUser(userId, slug);
      if (!access.campaign) {
        return res.status(404).json({ error: "Campaign nicht gefunden" });
      }
      if (
        !canEditCampaign(
          access.campaign.ownerId,
          access.membership?.role,
          userId,
        )
      ) {
        return res
          .status(403)
          .json({ error: "Keine Berechtigung zum Bearbeiten" });
      }

      const entity = access.campaign.entities.find(
        (entry) => entry.type === entityType && entry.slug === entitySlug,
      );
      if (!entity) {
        return res.status(404).json({ error: "Entity nicht gefunden" });
      }

      try {
        const updated = await prisma.$transaction(async (tx) => {
          await tx.entityField.deleteMany({ where: { entityId: entity.id } });
          await tx.contentBlock.deleteMany({ where: { entityId: entity.id } });

          return tx.entity.update({
            where: { id: entity.id },
            data: {
              name: payload.name ?? entity.name,
              slug: payload.slug ? createSlug(payload.slug) : entity.slug,
              summary: payload.summary ?? null,
              isVisible: payload.isVisible ?? true,
              sortOrder: payload.sortOrder ?? 0,
              fields: payload.headerFields?.length
                ? {
                    create: payload.headerFields.map((field, index) => ({
                      label: field.label,
                      value: field.value,
                      sortOrder: index,
                    })),
                  }
                : undefined,
              blocks: payload.cards?.length
                ? {
                    create: payload.cards.map((card, index) =>
                      mapCardToBlock(card, index),
                    ),
                  }
                : undefined,
            },
            include: {
              fields: { orderBy: { sortOrder: "asc" } },
              blocks: {
                orderBy: { sortOrder: "asc" },
                include: {
                  listItems: { orderBy: { sortOrder: "asc" } },
                  attributes: { orderBy: { sortOrder: "asc" } },
                },
              },
            },
          });
        });

        res.json(serializeEntity(updated));
      } catch (error) {
        res.status(400).json({
          error:
            error instanceof Error
              ? error.message
              : "Entity konnte nicht aktualisiert werden",
        });
      }
    },
  );

  app.delete(
    "/api/campaigns/:slug/entities/:type/:entitySlug",
    authenticateToken,
    async (req: AuthRequest, res: Response) => {
      const userId = req.user?.id;
      const slug = toSingleValue(req.params.slug);
      const type = toSingleValue(req.params.type);
      const entitySlug = toSingleValue(req.params.entitySlug);
      const apiType = type.toLowerCase() as keyof typeof ENTITY_TEMPLATES;
      const entityType = getEntityType(apiType);

      if (!userId) {
        return res
          .status(400)
          .json({ error: "User ID nicht im Token gefunden" });
      }
      if (!entityType) {
        return res.status(400).json({ error: "Ungültiger Entity-Typ" });
      }

      const access = await loadCampaignForUser(userId, slug);
      if (!access.campaign) {
        return res.status(404).json({ error: "Campaign nicht gefunden" });
      }
      if (
        !canEditCampaign(
          access.campaign.ownerId,
          access.membership?.role,
          userId,
        )
      ) {
        return res
          .status(403)
          .json({ error: "Keine Berechtigung zum Bearbeiten" });
      }

      const entity = access.campaign.entities.find(
        (entry) => entry.type === entityType && entry.slug === entitySlug,
      );
      if (!entity) {
        return res.status(404).json({ error: "Entity nicht gefunden" });
      }

      await prisma.entity.delete({ where: { id: entity.id } });
      res.json({ message: "Entity erfolgreich gelöscht" });
    },
  );
}
