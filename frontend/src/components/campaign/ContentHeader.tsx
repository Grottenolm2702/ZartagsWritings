import React from "react";
import contentStyles from "../../styles/content.module.css";
import type { ApiHeaderField } from "../../types/campaign-api";

export default function ContentHeader({
  fields,
  editable,
  onChange,
  onAdd,
  onRemove,
  onMove,
}: {
  fields: ApiHeaderField[];
  editable?: boolean;
  onChange?: (idx: number, updated: ApiHeaderField) => void;
  onAdd?: () => void;
  onRemove?: (idx: number) => void;
  onMove?: (idx: number, direction: -1 | 1) => void;
}) {
  if (!fields || fields.length === 0) return null;

  return (
    <section aria-label="Header section">
      <div className={contentStyles.contentHeader}>
        {fields.map((field, index) => (
          <section className={contentStyles.contentHeaderItem} key={index}>
            {editable ? (
              <>
                <input
                  className={contentStyles.headerInput}
                  value={field.label}
                  aria-label={`Header field ${index + 1} label`}
                  onChange={(e) =>
                    onChange?.(index, { ...field, label: e.target.value })
                  }
                  placeholder="Field name"
                />
                <input
                  className={contentStyles.headerInput}
                  value={field.value}
                  aria-label={`Header field ${index + 1} value`}
                  onChange={(e) =>
                    onChange?.(index, { ...field, value: e.target.value })
                  }
                  placeholder="Value"
                />
                <div className={contentStyles.headerActionRow}>
                  <button
                    type="button"
                    className={contentStyles.iconButton}
                    aria-label={`Move field ${index + 1} left`}
                    disabled={index === 0}
                    onClick={() => onMove?.(index, -1)}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className={contentStyles.iconButton}
                    aria-label={`Move field ${index + 1} right`}
                    disabled={index === fields.length - 1}
                    onClick={() => onMove?.(index, 1)}
                  >
                    →
                  </button>
                  <button
                    type="button"
                    className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
                    onClick={() => onRemove?.(index)}
                  >
                    Remove
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className={contentStyles.label}>{field.label}</span>
                <span>{field.value}</span>
              </>
            )}
          </section>
        ))}
      </div>
      {editable && onAdd ? (
        <div className={contentStyles.contentHeaderActions}>
          <button
            type="button"
            className={contentStyles.newButton}
            onClick={onAdd}
          >
            Add field
          </button>
        </div>
      ) : null}
    </section>
  );
}
