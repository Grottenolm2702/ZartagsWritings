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
  onMove?: (index: number, direction: -1 | 1) => void;
};

export default function ItemsGrid({ cards, editable, onUpdate, onRemove, onMove }: ItemsGridProps) {
  if (!cards || cards.length === 0) return null;

  return (
    <section className={contentStyles.itemsGrid} aria-label="Karten">
      <div className={contentStyles.itemsMasonry}>
        {cards.map((card, index) => (
          <ItemCard
            key={index}
            card={card}
            editable={editable}
            orderNumber={editable ? index + 1 : undefined}
            onUpdate={(updated) => onUpdate?.(index, updated)}
            onRemove={() => onRemove?.(index)}
            onMoveUp={onMove ? () => onMove(index, -1) : undefined}
            onMoveDown={onMove ? () => onMove(index, 1) : undefined}
            canMoveUp={index > 0}
            canMoveDown={index < cards.length - 1}
          >
            <CardContent
              content={card.content}
              editable={editable}
              onChange={(updated) => onUpdate?.(index, { ...card, content: updated })}
            />
          </ItemCard>
        ))}
      </div>
    </section>
  );
}
