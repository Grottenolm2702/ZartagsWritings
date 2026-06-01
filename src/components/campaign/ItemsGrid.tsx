import React from "react";
import ItemCard from "./ItemCard";

export type CardSpec = {
  title: string;
  content?: React.ReactNode;
  pictureSrc?: string;
  pictureAlt?: string;
  wide?: boolean;
};

export default function ItemsGrid({ cards }: { cards: CardSpec[] }) {
  if (!cards || cards.length === 0) return null;
  // filter out cards that have neither content nor picture
  const normal = cards.filter((c) => !c.wide && (c.content || c.pictureSrc));
  const wide = cards.filter((c) => c.wide && (c.content || c.pictureSrc));
  return (
    <div className="items-grid">
      <div className="items-masonry">
        {normal.map((c, i) => (
          <ItemCard
            key={i}
            title={c.title}
            pictureSrc={c.pictureSrc}
            pictureAlt={c.pictureAlt}
          >
            {c.content}
          </ItemCard>
        ))}
      </div>
      {wide.length > 0 && (
        <div className="item-card wide">
          {wide.map((c, i) => (
            <div key={i}>
              <h2>{c.title}</h2>
              {c.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
