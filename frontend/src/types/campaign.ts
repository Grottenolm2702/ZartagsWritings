export type CampaignType = "pc" | "npc" | "magicitem" | "location";

// Route paths
export const ROUTES = {
  CAMPAIGN_OVERVIEW: "/campaigns/:slug/overview",
  CAMPAIGN_MANAGE: "/campaigns/:slug/manage",
  CAMPAIGN_PC: "/campaigns/:slug/pc",
  CAMPAIGN_NPC: "/campaigns/:slug/npc",
  CAMPAIGN_MAGIC_ITEM: "/campaigns/:slug/magicitem",
  CAMPAIGN_LOCATION: "/campaigns/:slug/location",
} as const;

// Campaign type mappings
export const CAMPAIGN_TYPE_LABELS: Record<CampaignType, string> = {
  pc: "Player Character",
  npc: "Non Playable Character",
  magicitem: "Magic Item",
  location: "Location",
} as const;
