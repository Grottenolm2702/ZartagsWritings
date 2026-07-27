import React from "react";
import formStyles from "../../styles/forms.module.css";
import type { ApiCardContent } from "../../types/campaign-api";

type EditableCardContentProps = {
  content: ApiCardContent;
  onChange?: (content: ApiCardContent) => void;
};

export default function EditableCardContent({ content, onChange }: EditableCardContentProps) {
  if (content.type === "paragraph") {
    return (
      <textarea
        className={formStyles.formTextarea}
        rows={5}
        value={content.text}
        aria-label="Paragraph"
        onChange={(e) => onChange?.({ type: "paragraph", text: e.target.value })}
      />
    );
  }

  if (content.type === "paragraphs") {
    return (
      <div>
        {content.paragraphs.map((paragraph, index) => (
          <div key={index} className={formStyles.formTextareaContainer}>
            <textarea
              className={formStyles.formTextarea}
              rows={4}
              value={paragraph}
              aria-label={`Paragraph ${index + 1}`}
              onChange={(e) => {
                const next = [...content.paragraphs];
                next[index] = e.target.value;
                onChange?.({ type: "paragraphs", paragraphs: next });
              }}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange?.({ type: "paragraphs", paragraphs: [...content.paragraphs, ""] })
          }
        >
          Add paragraph
        </button>
      </div>
    );
  }

  if (content.type === "list") {
    return (
      <ul className={formStyles.listUnstyled}>
        {content.items.map((item, index) => (
          <li key={index} className={formStyles.listItemSpacer}>
            <div className={formStyles.listItemInputRow}>
              <input
                className={formStyles.formInputTransparent}
                value={item.label}
                aria-label={`Entry ${index + 1} label`}
                onChange={(e) => {
                  const next = content.items.map((entry, entryIndex) =>
                    entryIndex === index ? { ...entry, label: e.target.value } : entry,
                  );
                  onChange?.({ type: "list", items: next });
                }}
              />
              <input
                className={formStyles.formInputTransparent}
                value={item.href || ""}
                placeholder="Optional link"
                aria-label={`Entry ${index + 1} link`}
                onChange={(e) => {
                  const next = content.items.map((entry, entryIndex) =>
                    entryIndex === index ? { ...entry, href: e.target.value || undefined } : entry,
                  );
                  onChange?.({ type: "list", items: next });
                }}
              />
            </div>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() =>
              onChange?.({
                type: "list",
                items: [...content.items, { label: "", href: undefined }],
              })
            }
          >
            Add entry
          </button>
        </li>
      </ul>
    );
  }

  return (
    <>
      <dl>
      {content.items.map((item, index) => (
        <React.Fragment key={index}>
          <dt>
            <input
              className={formStyles.formInputTransparent}
              value={item.dt}
              aria-label={`Attribute ${index + 1} name`}
              onChange={(e) => {
                const next = content.items.map((entry, entryIndex) =>
                  entryIndex === index ? { ...entry, dt: e.target.value } : entry,
                );
                onChange?.({ type: "attributes", items: next });
              }}
            />
          </dt>
          <dd>
            <input
              className={formStyles.formInputTransparent}
              value={item.dd}
              aria-label={`Attribute ${index + 1} value`}
              onChange={(e) => {
                const next = content.items.map((entry, entryIndex) =>
                  entryIndex === index ? { ...entry, dd: e.target.value } : entry,
                );
                onChange?.({ type: "attributes", items: next });
              }}
            />
          </dd>
        </React.Fragment>
      ))}
      </dl>
      <div>
        <button
          type="button"
          onClick={() =>
            onChange?.({
              type: "attributes",
              items: [...content.items, { dt: "", dd: "" }],
            })
          }
        >
          Add attribute
        </button>
      </div>
    </>
  );
}
