import React from "react";
import contentStyles from "../../styles/content.module.css";
import formStyles from "../../styles/forms.module.css";
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
    <div>
      <div className={contentStyles.contentHeader}>
        {fields.map((field, index) => (
          <div className={contentStyles.contentHeaderItem} key={`${field.label}-${index}`}>
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
                    placeholder="Feldname"
                  />
                  <input
                    className={contentStyles.headerInput}
                    value={field.value}
                    onChange={(e) => onChange?.(index, { ...field, value: e.target.value })}
                    placeholder="Wert"
                  />
                  <button
                    type="button"
                    className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
                    onClick={() => onRemove?.(index)}
                  >
                    Entfernen
                  </button>
                </>
              )
            ) : (
              <>
                <span className={contentStyles.label}>{field.label}</span>
                <span>{field.value}</span>
              </>
            )}
          </div>
        ))}
      </div>
      {editable && onAdd ? (
        <div style={{ margin: "0.75rem 0.5rem 0" }}>
          <button type="button" className={contentStyles.newButton} onClick={onAdd}>
            Feld hinzufügen
          </button>
        </div>
      ) : null}
    </div>
  );
}
