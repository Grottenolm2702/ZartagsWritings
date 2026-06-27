import { ROUTES } from "../types/campaign";

/**
 * Slugify string for use in URLs and IDs.
 * Converts to lowercase, removes special chars, trims dashes.
 */
export const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/**
 * Build campaign item URL from type and slug
 */
export const buildCampaignUrl = (type: string, slug: string): string => {
  const typeMap: Record<string, string> = {
    pc: ROUTES.CAMPAIGN_PC,
    npc: ROUTES.CAMPAIGN_NPC,
    magicitem: ROUTES.CAMPAIGN_MAGIC_ITEM,
    location: ROUTES.CAMPAIGN_LOCATION,
  };
  return (typeMap[type] || ROUTES.CAMPAIGN_OVERVIEW).replace(":slug", slug);
};

/**
 * Extract type from route path
 */
export const getTypeFromRoute = (path: string): string | null => {
  const match = path.match(/\/campaigns\/[^/]+\/([a-z]+)/);
  return match?.[1] || null;
};
