import React from "react";
import contentStyles from "../../styles/content.module.css";
import formStyles from "../../styles/forms.module.css";
import type { ApiCardSpec } from "../../types/campaign-api";

type ItemCardProps = {
  card: ApiCardSpec;
  editable?: boolean;
  children?: React.ReactNode;
  onUpdate?: (updated: ApiCardSpec) => void;
  onRemove?: () => void;
};

export default function ItemCard({
  card,
  editable,
  children,
  onUpdate,
  onRemove,
}: ItemCardProps) {
  const updateCard = (patch: Partial<ApiCardSpec>) => {
    onUpdate?.({
      ...card,
      ...patch,
    });
  };

  return (
    <div className={`${contentStyles.itemCard}${card.wide ? ` ${contentStyles.wide}` : ""}`}>
      <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          {editable ? (
            <input
              className={contentStyles.cardTitleInput}
              value={card.title}
              onChange={(e) => updateCard({ title: e.target.value })}
            />
          ) : (
            <h2>{card.title}</h2>
          )}
        </div>

        {editable ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
              onClick={() => onRemove?.()}
            >
              Löschen
            </button>
          </div>
        ) : null}
      </div>

      {editable ? (
        <div className={contentStyles.pictureUrlField}>
          <label className={contentStyles.pictureUrlInput}>Bild URL</label>
          <input
            className={formStyles.formInputTransparent}
            value={card.pictureSrc || ""}
            onChange={(e) => updateCard({ pictureSrc: e.target.value || undefined })}
            placeholder="https://..."
          />
          <label className={contentStyles.pictureUrlInput}>Alt Text</label>
          <input
            className={formStyles.formInputTransparent}
            value={card.pictureAlt || ""}
            onChange={(e) => updateCard({ pictureAlt: e.target.value || undefined })}
          />
          <label
            className={contentStyles.pictureUrlInput}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "center",
              gap: 12,
              whiteSpace: "nowrap",
            }}
          >
            <span>Breite Karte</span>
            <input
              type="checkbox"
              checked={!!card.wide}
              onChange={(e) => updateCard({ wide: e.target.checked })}
            />{" "}
          </label>
        </div>
      ) : null}

      {children}

      {!editable && card.pictureSrc ? (
        <div className={contentStyles.itemPicture}>
          <img src={card.pictureSrc} alt={card.pictureAlt || card.title} />
        </div>
      ) : null}
    </div>
  );
}
