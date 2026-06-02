import React from "react";
import type {
  CardContent as CardContentType,
  AttributeItem,
  ListItem,
  ParagraphsContent,
  ParagraphContent,
  ListContent,
  AttributesContent,
} from "../../types/campaign";
import styles from "../../styles/forms.module.css";
import contentStyles from "../../styles/content.module.css";

interface EditableCardContentProps {
  content?: CardContentType;
  onChange?: (c: CardContentType) => void;
}

export default function EditableCardContent({
  content,
  onChange,
}: EditableCardContentProps) {
  const [state, setState] = React.useState<Partial<CardContentType>>(
    content || {},
  );

  if (!content) return null;

  function update(path: string, value: unknown) {
    setState((s) => {
      const copy = { ...s };
      (copy as Record<string, unknown>)[path] = value;
      // notify parent
      try {
        onChange?.(copy as CardContentType);
      } catch {}
      return copy;
    });
  }

  if (content.type === "paragraphs") {
    const stateTyped = state as Partial<ParagraphsContent>;
    const paragraphs: string[] = stateTyped.paragraphs ||
      content.paragraphs || [""];
    return (
      <div>
        {paragraphs.map((p: string, i: number) => (
          <div key={i} className={styles.formTextareaContainer}>
            <textarea
              value={paragraphs[i]}
              onChange={(e) => {
                const next = [...paragraphs];
                next[i] = e.target.value;
                update("paragraphs", next);
              }}
              rows={4}
              className={styles.formTextarea}
            />
          </div>
        ))}
        <button
          onClick={() => update("paragraphs", [...paragraphs, ""])}
          type="button"
        >
          Add paragraph
        </button>
      </div>
    );
  }

  if (content.type === "paragraph") {
    const stateTyped = state as Partial<ParagraphContent>;
    return (
      <div>
        <textarea
          value={stateTyped.text ?? content.text ?? ""}
          onChange={(e) => update("text", e.target.value)}
          rows={6}
          className={styles.formTextarea}
        />
      </div>
    );
  }

  if (content.type === "list") {
    const stateTyped = state as Partial<ListContent>;
    const items: ListItem[] = stateTyped.items || content.items || [];
    return (
      <ul className={styles.listUnstyled}>
        {items.map((it: ListItem, i: number) => (
          <li key={i} className={styles.listItemSpacer}>
            <input
              value={it.label || ""}
              onChange={(e) => {
                const next = items.map((x: ListItem, idx: number) =>
                  idx === i ? { ...x, label: e.target.value } : x,
                );
                update("items", next);
              }}
              className={styles.formInputTransparent}
            />
          </li>
        ))}
        <li>
          <button
            onClick={() => update("items", [...items, { label: "" }])}
            type="button"
          >
            Add item
          </button>
        </li>
      </ul>
    );
  }

  if (content.type === "attributes") {
    const stateTyped = state as Partial<AttributesContent>;
    const items: AttributeItem[] = stateTyped.items || content.items || [];
    return (
      <dl className={contentStyles.atributeList}>
        {items.map((it: AttributeItem, i: number) => (
          <React.Fragment key={i}>
            <dt>
              <input
                value={it.dt || ""}
                onChange={(e) => {
                  const next = items.map((x: AttributeItem, idx: number) =>
                    idx === i ? { ...x, dt: e.target.value } : x,
                  );
                  update("items", next);
                }}
                className={styles.formInputTransparent}
              />
            </dt>
            <dd>
              <input
                value={it.dd || ""}
                onChange={(e) => {
                  const next = items.map((x: AttributeItem, idx: number) =>
                    idx === i ? { ...x, dd: e.target.value } : x,
                  );
                  update("items", next);
                }}
                className={`${styles.formInputTransparent} ${styles.formInputFullWidth}`}
              />
            </dd>
          </React.Fragment>
        ))}
        <div>
          <button
            onClick={() => update("items", [...items, { dt: "", dd: "" }])}
            type="button"
          >
            Add attribute
          </button>
        </div>
      </dl>
    );
  }

  const _exhaustive: never = content;
  return <div>Unsupported content type for editing: {_exhaustive}</div>;
}
