export type ApiMemberRole = "DM" | "EDITOR" | "PLAYER";
export type ApiEntityType = "pc" | "npc" | "magicitem" | "location";

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

export type ApiEntity = {
  id: number;
  type: ApiEntityType;
  slug: string;
  name: string;
  summary?: string | null;
  isVisible: boolean;
  sortOrder: number;
  headerFields: ApiHeaderField[];
  cards: ApiCardSpec[];
};

export type ApiEntityTemplate = {
  type: ApiEntityType;
  name: string;
  summary: string;
  headerFields: ApiHeaderField[];
  cards: ApiCardSpec[];
};

export type ApiCampaignMember = {
  id: number;
  userId: number;
  role: ApiMemberRole;
  displayName?: string | null;
  joinedAt: string;
  user: {
    id: number;
    email: string;
    name?: string | null;
  };
};

export type ApiCampaign = {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  joinCode: string;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: number;
    email: string;
    name?: string | null;
  } | null;
  members: ApiCampaignMember[];
  entities: ApiEntity[];
};

export type ApiCampaignSummary = {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  joinCode: string;
  role: ApiMemberRole;
  displayName?: string | null;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: number;
    email: string;
    name?: string | null;
  } | null;
  counts?: {
    members: number;
    entities: number;
  };
};
