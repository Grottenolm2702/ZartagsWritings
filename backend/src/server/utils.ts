import { randomInt } from "node:crypto";
import type { ApiEntityType } from "./types.js";

export const ENTITY_TYPE_MAP: Record<ApiEntityType, "PC" | "NPC" | "MAGIC_ITEM" | "LOCATION"> = {
  pc: "PC",
  npc: "NPC",
  magicitem: "MAGIC_ITEM",
  location: "LOCATION",
};

export function createSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function toSingleValue(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

const JOIN_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const JOIN_CODE_LENGTH = 10;

export function createJoinCode(length = JOIN_CODE_LENGTH): string {
  return Array.from({ length }, () =>
    JOIN_CODE_ALPHABET[randomInt(JOIN_CODE_ALPHABET.length)],
  ).join("");
}

export function getEntityType(type: string): "PC" | "NPC" | "MAGIC_ITEM" | "LOCATION" | null {
  const normalized = type.toLowerCase() as ApiEntityType;
  return ENTITY_TYPE_MAP[normalized] ?? null;
}

export function entityTypeToApi(type: "PC" | "NPC" | "MAGIC_ITEM" | "LOCATION"): ApiEntityType {
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

export function parseParagraphs(text: string | null): string[] {
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
