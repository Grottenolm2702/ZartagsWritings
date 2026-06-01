import React from "react";
import ItemCard from "./ItemCard";
import CardContent from "./CardContent";
import { useAuthSafe } from "../../context/AuthContext";

export type CardSpec = {
  title: string;
  content?: any;
  pictureSrc?: string;
  pictureAlt?: string;
  wide?: boolean;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ItemsGrid({
  cards,
  type,
  onUpdate,
  onRemove,
}: {
  cards: CardSpec[];
  type?: string;
  onUpdate?: (idx: number, updated: CardSpec) => void;
  onRemove?: (idx: number) => void;
}) {
  const auth = useAuthSafe();

  if (!cards || cards.length === 0) return null;
  // filter out cards that have neither content nor picture
  const hasContent = (c: CardSpec) =>
    (c.content !== undefined && c.content !== null) ||
    c.pictureSrc !== undefined;
  const normal = cards.filter((c) => !c.wide && hasContent(c));
  const wide = cards.filter((c) => c.wide && hasContent(c));

  function renderContent(c: CardSpec, idx: number) {
    const anyContent: any = c.content as any;
    if (!anyContent) return null;
    // If content already a React element, return as-is
    if (React.isValidElement(anyContent)) return anyContent;
    // If plain object describing content, render CardContent with onChange
    if (typeof anyContent === "object") {
      return (
        <CardContent
          content={anyContent}
          onChange={(nc: any) =>
            onUpdate && onUpdate(idx, { ...c, content: nc })
          }
        />
      );
    }
    // Otherwise content might be simple string/node
    return anyContent;
  }

  return (
    <div className="items-grid">
      <div className="items-masonry">
        {normal.map((c, i) => (
          <ItemCard
            key={i}
            card={c}
            title={c.title}
            pictureSrc={c.pictureSrc}
            pictureAlt={c.pictureAlt}
            onUpdate={(updated) => onUpdate && onUpdate(i, updated)}
            onRemove={() => onRemove && onRemove(i)}
          >
            {renderContent(c, i)}
          </ItemCard>
        ))}
      </div>
      {wide.length > 0 && (
        <div className="item-card wide">
          {wide.map((c, i) => (
            <ItemCard
              key={i}
              card={c}
              title={c.title}
              pictureSrc={c.pictureSrc}
              pictureAlt={c.pictureAlt}
              wide
              onUpdate={(updated) => onUpdate && onUpdate(i, updated)}
              onRemove={() => onRemove && onRemove(i)}
            >
              {renderContent(c, i)}
            </ItemCard>
          ))}
        </div>
      )}
    </div>
  );
}
