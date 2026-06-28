import type { ApiCardSpec, ApiEntityTemplate } from "./types.js";
import { entityTypeToApi, parseParagraphs } from "./utils.js";
import { prisma } from "./config.js";

export const ENTITY_TYPE_LABELS: Record<"pc" | "npc" | "magicitem" | "location", string> = {
  pc: "Player Characters",
  npc: "NPCs",
  magicitem: "Magic Items",
  location: "Locations",
};

export const ENTITY_TEMPLATES: Record<"pc" | "npc" | "magicitem" | "location", ApiEntityTemplate> =
  {
    pc: {
      name: "Melissa",
      summary: "Fighter Tiefling",
      headerFields: [
        { label: "Name:", value: "Melissa" },
        { label: "Class:", value: "Fighter" },
        { label: "Race:", value: "Tiefling" },
      ],
      cards: [
        {
          title: "Short Description",
          content: {
            type: "paragraph",
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          },
        },
        {
          title: "Backstory",
          content: {
            type: "paragraph",
            text: "Character backstory content here. Replace with backend content when available.",
          },
        },
        {
          title: "Generell Notes",
          content: {
            type: "paragraph",
            text: "Misc notes. Replace with backend content when available.",
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
        { label: "Alignment:", value: "Caotic Neutral" },
      ],
      cards: [
        {
          title: "Short Description",
          content: {
            type: "paragraph",
            text: "Zartag is a half-dwarf wizard and the author of Robert's Mageikunde-Magazin. He sends daily letters to everyone who has ever taken a card from him, describing his day and showcasing new magical tools—even if they ask him to stop.",
          },
        },
        {
          title: "Story Points",
          content: {
            type: "list",
            items: [
              { label: "Zartag asks the party to escort him home (forest is dangerous)" },
              {
                label: "Zartag reveals the water is magically poisoned and points to the well as source.",
              },
            ],
          },
        },
        {
          title: "Picture",
          pictureSrc:
            "data:image/jpeg;base64,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",
          pictureAlt: "Character Picture",
        },
        {
          title: "Generell Notes",
          content: {
            type: "paragraph",
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
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
        { label: "Weight:", value: "???" },
        { label: "Cost:", value: "???" },
        { label: "Quantity:", value: "1" },
      ],
      cards: [
        {
          title: "Magical Attributes",
          content: {
            type: "attributes",
            items: [
              { dt: "School:", dd: "Abduration" },
              { dt: "Attunement:", dd: "None" },
            ],
          },
        },
        {
          title: "Effect",
          content: {
            type: "paragraph",
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          },
        },
        {
          title: "Generell Notes",
          content: {
            type: "paragraph",
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
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
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
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
