import React from "react";
import contentStyles from "../../styles/content.module.css";
import formStyles from "../../styles/forms.module.css";
import type { ApiCardSpec } from "../../types/campaign-api";

type ItemCardProps = {
  card: ApiCardSpec;
  editable?: boolean;
  orderNumber?: number;
  children?: React.ReactNode;
  onUpdate?: (updated: ApiCardSpec) => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
};

export default function ItemCard({
  card,
  editable,
  orderNumber,
  children,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: ItemCardProps) {
  const updateCard = (patch: Partial<ApiCardSpec>) => {
    onUpdate?.({
      ...card,
      ...patch,
    });
  };

  return (
    <article
      className={`${contentStyles.itemCard}${card.wide ? ` ${contentStyles.wide}` : ""}`}
    >
      <header className={contentStyles.itemCardHeader}>
        <div className={contentStyles.itemCardTitleWrap}>
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
          <div className={contentStyles.itemCardActions}>
            {orderNumber ? (
              <span
                className={contentStyles.cardOrderNumber}
                aria-label={`Card order ${orderNumber}`}
              >
                {orderNumber}
              </span>
            ) : null}
            <button
              type="button"
              className={contentStyles.iconButton}
              aria-label={`Move ${card.title} up`}
              disabled={!canMoveUp}
              onClick={() => onMoveUp?.()}
            >
              ↑
            </button>
            <button
              type="button"
              className={contentStyles.iconButton}
              aria-label={`Move ${card.title} down`}
              disabled={!canMoveDown}
              onClick={() => onMoveDown?.()}
            >
              ↓
            </button>
            <button
              type="button"
              className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
              onClick={() => onRemove?.()}
            >
              Delete
            </button>
          </div>
        ) : null}
      </header>

      {editable ? (
        <div className={contentStyles.pictureUrlField}>
          <label className={contentStyles.pictureUrlInput}>
            Image URL
            <input
              className={formStyles.formInputTransparent}
              value={card.pictureSrc || ""}
              onChange={(e) =>
                updateCard({ pictureSrc: e.target.value || undefined })
              }
              placeholder="https://..."
            />
          </label>
          <label className={contentStyles.pictureUrlInput}>
            Alt text
            <input
              className={formStyles.formInputTransparent}
              value={card.pictureAlt || ""}
              onChange={(e) =>
                updateCard({ pictureAlt: e.target.value || undefined })
              }
            />
          </label>
          <label
            className={`${contentStyles.pictureUrlInput} ${contentStyles.itemCardWideToggle}`}
          >
            <span>Wide card</span>
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
    </article>
  );
}
