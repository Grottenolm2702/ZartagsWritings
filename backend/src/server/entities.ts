import type { ApiCardSpec, ApiEntityTemplate } from "./types.js";
import { entityTypeToApi, parseParagraphs } from "./utils.js";
import { prisma } from "./config.js";

export const ENTITY_TYPE_LABELS: Record<
  "pc" | "npc" | "magicitem" | "location",
  string
> = {
  pc: "Player Characters",
  npc: "NPCs",
  magicitem: "Magic Items",
  location: "Locations",
};

export const ENTITY_TEMPLATES: Record<
  "pc" | "npc" | "magicitem" | "location",
  ApiEntityTemplate
> = {
  pc: {
    name: "Diuid von Tür",
    summary: "Ranger Diuid",
    headerFields: [
      { label: "Name:", value: "Diuid von Tür" },
      { label: "Class:", value: "Ranger" },
      { label: "Race:", value: "Deep Gnome" },
    ],
    cards: [
      {
        title: "Short Description",
        content: {
          type: "paragraph",
          text: "Diuid von Tür is a deep gnome ranger with the Gloomstalker subclass. He is a very reserved and shy person. Even though he has lived in the same village for over 5 years, he has never spoken to anyone.",
        },
      },
      {
        title: "Backstory",
        content: {
          type: "paragraph",
          text: "Diuid left the Underdark to explore the surface world after being attacked by too many landsharks.",
        },
      },
      {
        title: "General Notes",
        content: {
          type: "paragraph",
          text: "Misc notes.",
        },
        wide: true,
      },
    ],
  },
  npc: {
    name: "Zartag",
    summary: "Wizard Half-Dwarf",
    headerFields: [
      { label: "Name:", value: "Zartag" },
      { label: "Class:", value: "Wizard" },
      { label: "Race:", value: "Half-Dwarf" },
      { label: "Occupation:", value: "Influencer" },
      { label: "Alignment:", value: "Chaotic Neutral" },
    ],
    cards: [
      {
        title: "Short Description",
        content: {
          type: "paragraph",
          text: "Zartag is a half-dwarf wizard and the author of Robert's Magiekunde-Magazin. He sends daily letters to everyone who has ever taken a card from him, describing his day and showcasing new magical tools—even if they ask him to stop.",
        },
      },
      {
        title: "Story Points",
        content: {
          type: "list",
          items: [
            {
              label:
                "Zartag asks the party to escort him home (forest is dangerous)",
            },
            {
              label:
                "Zartag reveals the water is magically poisoned and points to the well as source.",
            },
          ],
        },
      },
      {
        title: "General Notes",
        content: {
          type: "paragraph",
          text: "Misc notes.",
        },
        wide: true,
      },
    ],
  },
  magicitem: {
    name: "Die Unendliche Geschichte",
    summary: "Magic Book",
    headerFields: [
      { label: "Name:", value: "Die Unendliche Geschichte" },
      { label: "Type:", value: "Magic Item" },
      { label: "Weight:", value: "2 lb." },
      { label: "Cost:", value: "20 GP" },
      { label: "Quantity:", value: "1" },
    ],
    cards: [
      {
        title: "Magical Attributes",
        content: {
          type: "attributes",
          items: [
            { dt: "School:", dd: "Abjuration" },
            { dt: "Attunement:", dd: "None" },
          ],
        },
      },
      {
        title: "Effect",
        content: {
          type: "paragraph",
          text: "Records any moment the reader experiences within its pages. If you draw in the book reality will be altered to match the displayed scene.",
        },
      },
      {
        title: "General Notes",
        content: {
          type: "paragraph",
          text: "Misc Notes.",
        },
        wide: true,
      },
    ],
  },
  location: {
    name: "Das Herrenhaus",
    summary: "Location",
    headerFields: [
      { label: "Name:", value: "Das Herrenhaus" },
      { label: "Type:", value: "House" },
    ],
    cards: [
      {
        title: "Short Description",
        content: {
          type: "paragraph",
          text: "An old magical mansion that has been abandoned for decades. The house is in a state of disrepair, with broken windows and a collapsed roof.",
        },
      },
      {
        title: "Related Places",
        content: {
          type: "list",
          items: [{ label: "Garten" }, { label: "Keller" }, { label: "Küche" }],
        },
      },
    ],
  },
};

export function mapCardToBlock(card: ApiCardSpec, sortOrder: number) {
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

export function serializeBlock(block: {
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

export function serializeEntity(entity: {
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
    type: entityTypeToApi(
      entity.type as "PC" | "NPC" | "MAGIC_ITEM" | "LOCATION",
    ),
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

export async function loadCampaignForUser(userId: number, slug: string) {
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

export function canEditCampaign(
  ownerId: number | null | undefined,
  membershipRole: string | null | undefined,
  userId: number,
) {
  if (ownerId === userId) return true;
  return membershipRole === "DM" || membershipRole === "EDITOR";
}
