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

export type RawData = {
  pc: CampaignData;
  npc: CampaignData;
  magicItem: CampaignData;
  location: CampaignData;
  overview?: {
    campaignPlayers?: Array<{
      id: string;
      name: string;
      isEditor: boolean;
    }>;
  };
};

// Navigation state
export type NavigationState = {
  newDraft?: boolean;
  header?: HeaderField[];
  cards?: CardSpec[];
};
