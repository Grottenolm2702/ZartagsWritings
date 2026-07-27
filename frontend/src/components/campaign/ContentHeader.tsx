import React from "react";
import contentStyles from "../../styles/content.module.css";
import type { ApiHeaderField } from "../../types/campaign-api";

export default function ContentHeader({
  fields,
  editable,
  onChange,
  onAdd,
  onRemove,
}: {
  fields: ApiHeaderField[];
  editable?: boolean;
  onChange?: (idx: number, updated: ApiHeaderField) => void;
  onAdd?: () => void;
  onRemove?: (idx: number) => void;
}) {
  if (!fields || fields.length === 0) return null;

  return (
    <section aria-label="Header section">
      <div className={contentStyles.contentHeader}>
        {fields.map((field, index) => (
          <section className={contentStyles.contentHeaderItem} key={`${field.label}-${index}`}>
            {editable ? (
              index === 0 ? (
                <>
                  <span className={contentStyles.label}>{field.label}</span>
                  <input
                    className={contentStyles.headerInput}
                    value={field.value}
                    onChange={(e) => onChange?.(index, { ...field, value: e.target.value })}
                  />
                </>
              ) : (
                <>
                  <input
                    className={contentStyles.headerInput}
                    value={field.label}
                    onChange={(e) => onChange?.(index, { ...field, label: e.target.value })}
                    placeholder="Field name"
                  />
                  <input
                    className={contentStyles.headerInput}
                    value={field.value}
                    onChange={(e) => onChange?.(index, { ...field, value: e.target.value })}
                    placeholder="Value"
                  />
                  <button
                    type="button"
                    className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
                    onClick={() => onRemove?.(index)}
                  >
                    Remove
                  </button>
                </>
              )
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
          <button type="button" className={contentStyles.newButton} onClick={onAdd}>
            Add field
          </button>
        </div>
      ) : null}
    </section>
  );
}
