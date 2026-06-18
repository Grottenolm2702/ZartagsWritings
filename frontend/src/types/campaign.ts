// Content types
export type ParagraphContent = {
  type: "paragraph";
  text: string;
};

export type ParagraphsContent = {
  type: "paragraphs";
  paragraphs: string[];
};

export type ListItem = {
  label: string;
  href?: string;
};

export type ListContent = {
  type: "list";
  items: ListItem[];
};

export type AttributeItem = {
  dt: string;
  dd: string;
};

export type AttributesContent = {
  type: "attributes";
  items: AttributeItem[];
  className?: string;
};

export type CardContent =
  | ParagraphContent
  | ParagraphsContent
  | ListContent
  | AttributesContent;

// Header and Card types
export type HeaderField = {
  label: string;
  value: string;
};

export type CardSpec = {
  title: string;
  content?: CardContent;
  pictureSrc?: string;
  pictureAlt?: string;
  wide?: boolean;
};

// Campaign data structure
export type CampaignData = {
  title?: string;
  header: HeaderField[];
  cards: CardSpec[];
};

export type CampaignType = "pc" | "npc" | "magicitem" | "location";

// Player management
export type Player = {
  id: string;
  name: string;
  isEditor?: boolean;
};

export type RawData = {
  pc: CampaignData;
  npc: CampaignData;
  magicItem: CampaignData;
  location: CampaignData;
  overview?: {
    campaignPlayers?: Player[];
  };
};

// Navigation state
export type NavigationState = {
  newDraft?: boolean;
  header?: HeaderField[];
  cards?: CardSpec[];
};

// Storage keys
export const STORAGE_KEYS = {
  PLAYERS: "campaign:players",
  DM_ID: "campaign:dm",
  CURRENT_PLAYER_ID: "currentPlayerId",
} as const;

// Route paths
export const ROUTES = {
  CAMPAIGN_OVERVIEW: "/capaign1",
  CAMPAIGN_MANAGE: "/capaign1/manage",
  CAMPAIGN_PC: "/capaign1/pc",
  CAMPAIGN_NPC: "/capaign1/npc",
  CAMPAIGN_MAGIC_ITEM: "/capaign1/magicitem",
  CAMPAIGN_LOCATION: "/capaign1/location",
} as const;

// Campaign type mappings
export const CAMPAIGN_TYPE_LABELS: Record<CampaignType, string> = {
  pc: "Player Character",
  npc: "Non Playable Character",
  magicitem: "Magic Item",
  location: "Location",
} as const;
