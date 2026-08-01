import React from "react";
import contentStyles from "../../styles/content.module.css";
import formStyles from "../../styles/forms.module.css";
import type { ApiCardContent } from "../../types/campaign-api";

type EditableCardContentProps = {
  content: ApiCardContent;
  onChange?: (content: ApiCardContent) => void;
};

type AutoResizeTextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const AutoResizeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AutoResizeTextareaProps
>(function AutoResizeTextarea({ onChange, style, ...props }, forwardedRef) {
  const localRef = React.useRef<HTMLTextAreaElement | null>(null);

  const setRef = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      localRef.current = node;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef],
  );

  React.useLayoutEffect(() => {
    const element = localRef.current;
    if (!element) return;

    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [props.value]);

  return (
    <textarea
      {...props}
      ref={setRef}
      onChange={onChange}
      style={{ ...style, overflow: "hidden", resize: "none" }}
    />
  );
});

export default function EditableCardContent({
  content,
  onChange,
}: EditableCardContentProps) {
  if (content.type === "paragraph") {
    return (
      <AutoResizeTextarea
        className={formStyles.formTextarea}
        rows={5}
        value={content.text}
        aria-label="Paragraph"
        onChange={(e) =>
          onChange?.({ type: "paragraph", text: e.target.value })
        }
      />
    );
  }

  if (content.type === "paragraphs") {
    return (
      <div>
        {content.paragraphs.map((paragraph, index) => (
          <div key={index} className={formStyles.formTextareaContainer}>
            <AutoResizeTextarea
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
            <button
              type="button"
              className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
              aria-label={`Remove paragraph ${index + 1}`}
              onClick={() =>
                onChange?.({
                  type: "paragraphs",
                  paragraphs: content.paragraphs.filter(
                    (_, paragraphIndex) => paragraphIndex !== index,
                  ),
                })
              }
            >
              Remove paragraph
            </button>
          </div>
        ))}
        <button
          type="button"
          className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
          onClick={() =>
            onChange?.({
              type: "paragraphs",
              paragraphs: [...content.paragraphs, ""],
            })
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
            <div className={formStyles.listItemInputColumn}>
              <AutoResizeTextarea
                className={formStyles.formInputTransparent}
                value={item.label}
                aria-label={`Entry ${index + 1} label`}
                rows={1}
                onChange={(e) => {
                  const next = content.items.map((entry, entryIndex) =>
                    entryIndex === index
                      ? { ...entry, label: e.target.value }
                      : entry,
                  );
                  onChange?.({ type: "list", items: next });
                }}
              />
              <AutoResizeTextarea
                className={formStyles.formInputTransparent}
                value={item.href || ""}
                placeholder="Optional link"
                aria-label={`Entry ${index + 1} link`}
                rows={1}
                onChange={(e) => {
                  const next = content.items.map((entry, entryIndex) =>
                    entryIndex === index
                      ? { ...entry, href: e.target.value || undefined }
                      : entry,
                  );
                  onChange?.({ type: "list", items: next });
                }}
              />
              <button
                type="button"
                className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
                aria-label={`Remove entry ${index + 1}`}
                onClick={() =>
                  onChange?.({
                    type: "list",
                    items: content.items.filter(
                      (_, entryIndex) => entryIndex !== index,
                    ),
                  })
                }
              >
                Remove entry
              </button>
            </div>
          </li>
        ))}
        <li>
          <button
            type="button"
            className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
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
                    entryIndex === index
                      ? { ...entry, dt: e.target.value }
                      : entry,
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
                    entryIndex === index
                      ? { ...entry, dd: e.target.value }
                      : entry,
                  );
                  onChange?.({ type: "attributes", items: next });
                }}
              />
              <button
                type="button"
                className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
                onClick={() =>
                  onChange?.({
                    type: "attributes",
                    items: content.items.filter(
                      (_, entryIndex) => entryIndex !== index,
                    ),
                  })
                }
              >
                Remove attribute
              </button>
            </dd>
          </React.Fragment>
        ))}
      </dl>
      <div>
        <button
          type="button"
          className={contentStyles.actionButton}
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
