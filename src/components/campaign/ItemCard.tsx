import React from "react";
import { Link } from "react-router-dom";
import { useAuthSafe } from "../../context/AuthContext";

export default function ItemCard({
  card,
  title,
  children,
  pictureSrc,
  pictureAlt,
  wide,
  onUpdate,
  onRemove,
}: {
  card?: any;
  title: string;
  children?: React.ReactNode;
  pictureSrc?: string;
  pictureAlt?: string;
  wide?: boolean;
  onUpdate?: (updated: any) => void;
  onRemove?: () => void;
}) {
  const auth = useAuthSafe();

  // local handlers for updating card fields
  const updateField = (patch: any) => {
    if (onUpdate) {
      const updated = {
        ...(card || {}),
        title,
        pictureSrc,
        pictureAlt,
        ...patch,
      };
      onUpdate(updated);
    }
  };

  return (
    <div className={"item-card" + (wide ? " wide" : "")}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
        }}
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
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
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
                    onRemove && onRemove();
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
        (card && card.content && card.content.type === "picture") ||
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
