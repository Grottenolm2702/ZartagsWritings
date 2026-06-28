import type { Request } from "express";

export interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

export type ApiEntityType = "pc" | "npc" | "magicitem" | "location";
export type ApiBlockType = "paragraph" | "paragraphs" | "list" | "attributes" | "picture";

export type ApiHeaderField = {
  label: string;
  value: string;
};

export type ApiCardContent =
  | { type: "paragraph"; text: string }
  | { type: "paragraphs"; paragraphs: string[] }
  | { type: "list"; items: { label: string; href?: string }[] }
  | { type: "attributes"; items: { dt: string; dd: string }[] };

export type ApiCardSpec = {
  title: string;
  content?: ApiCardContent;
  pictureSrc?: string;
  pictureAlt?: string;
  wide?: boolean;
};

export type ApiEntityPayload = {
  slug?: string;
  name: string;
  summary?: string | null;
  isVisible?: boolean;
  sortOrder?: number;
  headerFields?: ApiHeaderField[];
  cards?: ApiCardSpec[];
};

export type ApiEntityTemplate = {
  name: string;
  summary: string;
  headerFields: ApiHeaderField[];
  cards: ApiCardSpec[];
};
