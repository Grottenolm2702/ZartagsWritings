import React from "react";
import contentStyles from "../../styles/content.module.css";
import type { ApiCardSpec } from "../../types/campaign-api";
import CardContent from "./CardContent";
import ItemCard from "./ItemCard";

type ItemsGridProps = {
  cards: ApiCardSpec[];
  editable?: boolean;
  onUpdate?: (index: number, updated: ApiCardSpec) => void;
  onRemove?: (index: number) => void;
};

export default function ItemsGrid({ cards, editable, onUpdate, onRemove }: ItemsGridProps) {
  if (!cards || cards.length === 0) return null;
  const normalCards = cards
    .map((card, index) => ({ card, index }))
    .filter(({ card }) => !card.wide);
  const wideCards = cards
    .map((card, index) => ({ card, index }))
    .filter(({ card }) => card.wide);

  return (
    <div className={contentStyles.itemsGrid}>
      <div className={contentStyles.itemsMasonry}>
        {normalCards.map(({ card, index }) => (
            <ItemCard
              key={index}
              card={card}
              editable={editable}
              onUpdate={(updated) => onUpdate?.(index, updated)}
              onRemove={() => onRemove?.(index)}
            >
              <CardContent
                content={card.content}
                editable={editable}
                onChange={(updated) => onUpdate?.(index, { ...card, content: updated })}
              />
            </ItemCard>
          ))}
      </div>

      {wideCards.length > 0 ? (
        <div style={{ marginTop: 12 }}>
          {wideCards.map(({ card, index }) => (
            <ItemCard
              key={index}
              card={card}
              editable={editable}
              onUpdate={(updated) => onUpdate?.(index, updated)}
              onRemove={() => onRemove?.(index)}
            >
              <CardContent
                content={card.content}
                editable={editable}
                onChange={(updated) => onUpdate?.(index, { ...card, content: updated })}
              />
            </ItemCard>
          ))}
        </div>
      ) : null}
    </div>
  );
}
