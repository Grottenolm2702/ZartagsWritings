import React from "react";
import { useAuthSafe } from "../../context/AuthContext";
import type { CardSpec } from "../../types/campaign";
import layoutStyles from "../../styles/layout.module.css";

interface ItemCardProps {
  card?: CardSpec;
  title: string;
  children?: React.ReactNode;
  pictureSrc?: string;
  pictureAlt?: string;
  wide?: boolean;
  onUpdate?: (updated: CardSpec) => void;
  onRemove?: () => void;
}

export default function ItemCard({
  card,
  title,
  children,
  pictureSrc,
  pictureAlt,
  wide,
  onUpdate,
  onRemove,
}: ItemCardProps) {
  const auth = useAuthSafe();

  // local handlers for updating card fields
  const updateField = (patch: Partial<CardSpec>) => {
    if (!onUpdate) return;
    const updated: CardSpec = {
      ...(card || { title: "" }),
      title,
      pictureSrc,
      pictureAlt,
      ...patch,
    };
    onUpdate(updated);
  };

  return (
    <div className={"item-card" + (wide ? " wide" : "")}>
      <div
        className={layoutStyles.flexRow}
        style={{ justifyContent: "space-between" }}
      >
        <div style={{ flex: 1 }}>
          {auth.isEditor ? (
            <input
              className="item-title-input"
              defaultValue={title}
              onChange={(e) => updateField({ title: e.target.value })}
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                border: "none",
                background: "transparent",
              }}
            />
          ) : (
            <h2>{title}</h2>
          )}
        </div>

        {auth.isEditor && onRemove ? (
          <div className={layoutStyles.flexRow}>
            <button
              className="action-button secondary"
              onClick={() => {
                try {
                  // confirm destructive action
                  if (
                    window.confirm(
                      `Delete field '${title}'? This cannot be undone.`,
                    )
                  ) {
                    onRemove?.();
                  }
                } catch {}
              }}
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>

      {auth.isEditor &&
      onUpdate &&
      (card?.pictureSrc !== undefined ||
        (card &&
          card.content &&
          (card.content as unknown as Record<string, unknown>).type ===
            "picture") ||
        pictureSrc) ? (
        <div style={{ marginTop: "8px", marginBottom: "8px" }}>
          <label style={{ display: "block", fontWeight: 600 }}>
            Picture URL
          </label>
          <input
            value={pictureSrc || (card && (card.pictureSrc || ""))}
            onChange={(e) => updateField({ pictureSrc: e.target.value })}
            placeholder="https://..."
            style={{ width: "100%", border: "none", background: "transparent" }}
          />
          <label
            style={{ display: "block", fontWeight: 600, marginTop: "6px" }}
          >
            Alt text
          </label>
          <input
            value={pictureAlt || (card && (card.pictureAlt || ""))}
            onChange={(e) => updateField({ pictureAlt: e.target.value })}
            placeholder="Image description"
            style={{ width: "100%", border: "none", background: "transparent" }}
          />
        </div>
      ) : null}

      {children}
      {pictureSrc ? (
        <div className="item-picture">
          <img src={pictureSrc} alt={pictureAlt || title} />
        </div>
      ) : null}
    </div>
  );
}
