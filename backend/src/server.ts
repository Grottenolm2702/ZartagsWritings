import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./generated/client.js";
import type { Request, Response, NextFunction } from "express";

dotenv.config();

const app = express();
const PORT = 3000;
const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

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

type ApiEntityType = "pc" | "npc" | "magicitem" | "location";
type ApiBlockType = "paragraph" | "paragraphs" | "list" | "attributes" | "picture";

type ApiHeaderField = {
  label: string;
  value: string;
};

type ApiCardContent =
  | { type: "paragraph"; text: string }
  | { type: "paragraphs"; paragraphs: string[] }
  | { type: "list"; items: { label: string; href?: string }[] }
  | { type: "attributes"; items: { dt: string; dd: string }[] };

type ApiCardSpec = {
  title: string;
  content?: ApiCardContent;
  pictureSrc?: string;
  pictureAlt?: string;
  wide?: boolean;
};

type ApiEntityPayload = {
  slug?: string;
  name: string;
  summary?: string | null;
  isVisible?: boolean;
  sortOrder?: number;
  headerFields?: ApiHeaderField[];
  cards?: ApiCardSpec[];
};

const ENTITY_TYPE_MAP: Record<ApiEntityType, "PC" | "NPC" | "MAGIC_ITEM" | "LOCATION"> = {
  pc: "PC",
  npc: "NPC",
  magicitem: "MAGIC_ITEM",
  location: "LOCATION",
};

const ENTITY_TYPE_LABELS: Record<ApiEntityType, string> = {
  pc: "Player Characters",
  npc: "NPCs",
  magicitem: "Magic Items",
  location: "Locations",
};

function createSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function toSingleValue(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

function createJoinCode(): string {
  return randomBytes(3).toString("hex").toUpperCase();
}

function getEntityType(type: string): "PC" | "NPC" | "MAGIC_ITEM" | "LOCATION" | null {
  const normalized = type.toLowerCase() as ApiEntityType;
  return ENTITY_TYPE_MAP[normalized] ?? null;
}

function entityTypeToApi(type: "PC" | "NPC" | "MAGIC_ITEM" | "LOCATION"): ApiEntityType {
  switch (type) {
    case "PC":
      return "pc";
    case "NPC":
      return "npc";
    case "MAGIC_ITEM":
      return "magicitem";
    case "LOCATION":
      return "location";
  }
}

function parseParagraphs(text: string | null): string[] {
  if (!text) return [];
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === "string") : [];
  } catch {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
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

function mapCardToBlock(card: ApiCardSpec, sortOrder: number) {
  if (card.pictureSrc || card.pictureAlt) {
    return {
      type: "IMAGE" as const,
      title: card.title,
      sortOrder,
      isWide: !!card.wide,
      imageUrl: card.pictureSrc ?? null,
      imageAlt: card.pictureAlt ?? null,
    };
  }

  const content = card.content;
  if (!content) {
    return {
      type: "PARAGRAPH" as const,
      title: card.title,
      sortOrder,
      isWide: !!card.wide,
      text: "",
    };
  }

  if (content.type === "paragraph") {
    return {
      type: "PARAGRAPH" as const,
      title: card.title,
      sortOrder,
      isWide: !!card.wide,
      text: content.text,
    };
  }

  if (content.type === "paragraphs") {
    return {
      type: "PARAGRAPHS" as const,
      title: card.title,
      sortOrder,
      isWide: !!card.wide,
      text: JSON.stringify(content.paragraphs),
    };
  }

  if (content.type === "list") {
    return {
      type: "LIST" as const,
      title: card.title,
      sortOrder,
      isWide: !!card.wide,
      listItems: {
        create: content.items.map((item, index) => ({
          label: item.label,
          href: item.href ?? null,
          sortOrder: index,
        })),
      },
    };
  }

  return {
    type: "ATTRIBUTES" as const,
    title: card.title,
    sortOrder,
    isWide: !!card.wide,
    attributes: {
      create: content.items.map((item, index) => ({
        label: item.dt,
        value: item.dd,
        sortOrder: index,
      })),
    },
  };
}

function serializeBlock(block: {
  title: string;
  type: string;
  text: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  isWide: boolean;
  listItems: { label: string; href: string | null; sortOrder: number }[];
  attributes: { label: string; value: string; sortOrder: number }[];
}): ApiCardSpec {
  if (block.type === "IMAGE") {
    return {
      title: block.title,
      pictureSrc: block.imageUrl ?? undefined,
      pictureAlt: block.imageAlt ?? undefined,
      wide: block.isWide,
    };
  }

  if (block.type === "PARAGRAPHS") {
    return {
      title: block.title,
      content: { type: "paragraphs", paragraphs: parseParagraphs(block.text) },
      wide: block.isWide,
    };
  }

  if (block.type === "LIST") {
    return {
      title: block.title,
      content: {
        type: "list",
        items: [...block.listItems]
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((item) => ({
            label: item.label,
            href: item.href ?? undefined,
          })),
      },
      wide: block.isWide,
    };
  }

  if (block.type === "ATTRIBUTES") {
    return {
      title: block.title,
      content: {
        type: "attributes",
        items: [...block.attributes]
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((item) => ({
            dt: item.label,
            dd: item.value,
          })),
      },
      wide: block.isWide,
    };
  }

  return {
    title: block.title,
    content: { type: "paragraph", text: block.text ?? "" },
    wide: block.isWide,
  };
}

function serializeEntity(entity: {
  id: number;
  type: string;
  slug: string;
  name: string;
  summary: string | null;
  isVisible: boolean;
  sortOrder: number;
  fields: { label: string; value: string; sortOrder: number }[];
  blocks: {
    sortOrder: number;
    title: string;
    type: string;
    text: string | null;
    imageUrl: string | null;
    imageAlt: string | null;
    isWide: boolean;
    listItems: { label: string; href: string | null; sortOrder: number }[];
    attributes: { label: string; value: string; sortOrder: number }[];
  }[];
}) {
  return {
    id: entity.id,
    type: entityTypeToApi(entity.type as "PC" | "NPC" | "MAGIC_ITEM" | "LOCATION"),
    slug: entity.slug,
    name: entity.name,
    summary: entity.summary,
    isVisible: entity.isVisible,
    sortOrder: entity.sortOrder,
    headerFields: [...entity.fields]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((field) => ({ label: field.label, value: field.value })),
    cards: [...entity.blocks]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(serializeBlock),
  };
}

async function loadCampaignForUser(userId: number, slug: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { slug },
    include: {
      owner: { select: { id: true, email: true, name: true } },
      members: {
        include: {
          user: { select: { id: true, email: true, name: true } },
        },
      },
      entities: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
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
      },
    },
  });

  if (!campaign) {
    return { campaign: null, membership: null };
  }

  const membership =
    campaign.members.find((member) => member.userId === userId) ?? null;

  return { campaign, membership };
}

function canEditCampaign(
  ownerId: number | null | undefined,
  membershipRole: string | null | undefined,
  userId: number,
) {
  if (ownerId === userId) return true;
  return membershipRole === "DM" || membershipRole === "EDITOR";
}

app.post("/api/register", async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "E-Mail und Passwort sind erforderlich" });
  }

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
    const message =
      error instanceof Error
        ? error.message
        : "Unbekannter Fehler beim Registrieren";

    if (message.includes("UNIQUE constraint failed: User.email")) {
      return res.status(409).json({ error: "Diese E-Mail ist bereits registriert" });
    }

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
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });
    res.json({ message: "Login erfolgreich" });
  } catch (error) {
    res.status(500).json({ error: "Fehler bei der Anmeldung" });
  }
});

app.post("/api/logout", (_req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logout erfolgreich" });
});

app.get("/api/user", authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ error: "User ID nicht im Token gefunden" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        memberships: {
          include: {
            campaign: {
              select: {
                id: true,
                slug: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });
    if (!user) {
      return res.status(404).json({ error: "Benutzer nicht gefunden" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Abrufen des Benutzers" });
  }
});

app.delete("/api/user", authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ error: "User ID nicht im Token gefunden" });
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ message: "Benutzer erfolgreich gelöscht" });
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Löschen des Benutzers" });
  }
});

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
      return res.status(400).json({ error: "User ID nicht im Token gefunden" });
    }
    if (!entityType) {
      return res.status(400).json({ error: "Ungültiger Entity-Typ" });
    }

    const access = await loadCampaignForUser(userId, slug);
    if (!access.campaign) {
      return res.status(404).json({ error: "Campaign nicht gefunden" });
    }
    if (!access.membership && access.campaign.ownerId !== userId) {
      return res.status(403).json({ error: "Kein Zugriff auf diese Campaign" });
    }

    const entities = access.campaign.entities.filter((entity) => entity.type === entityType);
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
      return res.status(400).json({ error: "User ID nicht im Token gefunden" });
    }
    if (!entityType) {
      return res.status(400).json({ error: "Ungültiger Entity-Typ" });
    }

    const access = await loadCampaignForUser(userId, slug);
    if (!access.campaign) {
      return res.status(404).json({ error: "Campaign nicht gefunden" });
    }
    if (!access.membership && access.campaign.ownerId !== userId) {
      return res.status(403).json({ error: "Kein Zugriff auf diese Campaign" });
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
      return res.status(400).json({ error: "User ID nicht im Token gefunden" });
    }
    if (!entityType) {
      return res.status(400).json({ error: "Ungültiger Entity-Typ" });
    }

    const access = await loadCampaignForUser(userId, slug);
    if (!access.campaign) {
      return res.status(404).json({ error: "Campaign nicht gefunden" });
    }
    if (!canEditCampaign(access.campaign.ownerId, access.membership?.role, userId)) {
      return res.status(403).json({ error: "Keine Berechtigung zum Bearbeiten" });
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
                create: payload.cards.map((card, index) => mapCardToBlock(card, index)),
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
        error: error instanceof Error ? error.message : "Entity konnte nicht erstellt werden",
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
      return res.status(400).json({ error: "User ID nicht im Token gefunden" });
    }
    if (!entityType) {
      return res.status(400).json({ error: "Ungültiger Entity-Typ" });
    }

    const access = await loadCampaignForUser(userId, slug);
    if (!access.campaign) {
      return res.status(404).json({ error: "Campaign nicht gefunden" });
    }
    if (!canEditCampaign(access.campaign.ownerId, access.membership?.role, userId)) {
      return res.status(403).json({ error: "Keine Berechtigung zum Bearbeiten" });
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
                  create: payload.cards.map((card, index) => mapCardToBlock(card, index)),
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
        error: error instanceof Error ? error.message : "Entity konnte nicht aktualisiert werden",
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
    const apiType = type.toLowerCase() as ApiEntityType;
    const entityType = getEntityType(apiType);

    if (!userId) {
      return res.status(400).json({ error: "User ID nicht im Token gefunden" });
    }
    if (!entityType) {
      return res.status(400).json({ error: "Ungültiger Entity-Typ" });
    }

    const access = await loadCampaignForUser(userId, slug);
    if (!access.campaign) {
      return res.status(404).json({ error: "Campaign nicht gefunden" });
    }
    if (!canEditCampaign(access.campaign.ownerId, access.membership?.role, userId)) {
      return res.status(403).json({ error: "Keine Berechtigung zum Bearbeiten" });
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
      return res.status(400).json({ error: "User ID nicht im Token gefunden" });
    }

    const access = await loadCampaignForUser(userId, slug);
    if (!access.campaign) {
      return res.status(404).json({ error: "Campaign nicht gefunden" });
    }
    if (!canEditCampaign(access.campaign.ownerId, access.membership?.role, userId)) {
      return res.status(403).json({ error: "Keine Berechtigung zum Bearbeiten" });
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

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, message: "Hallo vom eigenen Backend!" });
});

app.listen(PORT, () => {
  console.log(`Backend Server laeuft auf http://localhost:${PORT}`);
});
