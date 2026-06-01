import React from "react";
import raw from "./exampleData.json";
import type { HeaderField } from "../components/campaign/ContentHeader";
import type { CardSpec } from "../components/campaign/ItemsGrid";

function toCardSpec(card: any): CardSpec {
  const cs: CardSpec = {
    title: card.title,
    content: card.contentHtml ? (
      <div dangerouslySetInnerHTML={{ __html: card.contentHtml }} />
    ) : undefined,
    pictureSrc: card.pictureSrc,
    pictureAlt: card.pictureAlt,
    wide: card.wide,
  } as CardSpec;
  return cs;
}

export const PC_EXAMPLE: { header: HeaderField[]; cards: CardSpec[] } = {
  header: raw.pc.header as HeaderField[],
  cards: (raw.pc.cards as any[]).map(toCardSpec),
};

export const NPC_EXAMPLE: { header: HeaderField[]; cards: CardSpec[] } = {
  header: raw.npc.header as HeaderField[],
  cards: (raw.npc.cards as any[]).map(toCardSpec),
};

export const MAGICITEM_EXAMPLE: { header: HeaderField[]; cards: CardSpec[] } = {
  header: raw.magicItem.header as HeaderField[],
  cards: (raw.magicItem.cards as any[]).map(toCardSpec),
};

export const LOCATION_EXAMPLE: { header: HeaderField[]; cards: CardSpec[] } = {
  header: raw.location.header as HeaderField[],
  cards: (raw.location.cards as any[]).map(toCardSpec),
};

export const OVERVIEW_EXAMPLE = raw.overview;

export default raw;
