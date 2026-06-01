import React from "react";
import type {
  CardContent as CardContentType,
  AttributeItem,
  ListItem,
} from "../../types/campaign";

interface EditableCardContentProps {
  content?: CardContentType;
  onChange?: (c: CardContentType) => void;
}

export default function EditableCardContent({
  content,
  onChange,
}: EditableCardContentProps) {
  const [state, setState] = React.useState<Partial<CardContentType>>(
    content || {}
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

  const textareaStyle: React.CSSProperties = {
    width: "100%",
    border: "none",
    background: "transparent",
    padding: 0,
    font: "inherit",
    resize: "vertical",
  };

  if (content.type === "paragraphs") {
    const paragraphs: string[] = state.paragraphs || content.paragraphs || [""];
    return (
      <div>
        {paragraphs.map((p: string, i: number) => (
          <div key={i} style={{ marginBottom: "0.5rem" }}>
            <textarea
              value={paragraphs[i]}
              onChange={(e) => {
                const next = [...paragraphs];
                next[i] = e.target.value;
                update("paragraphs", next);
              }}
              rows={4}
              style={{ ...textareaStyle }}
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
    return (
      <div>
        <textarea
          value={state.text ?? content.text ?? ""}
          onChange={(e) => update("text", e.target.value)}
          rows={6}
          style={textareaStyle}
        />
      </div>
    );
  }

  if (content.type === "list") {
    const items: ListItem[] = state.items || content.items || [];
    return (
      <ul>
        {items.map((it: ListItem, i: number) => (
          <li key={i} style={{ marginBottom: "0.25rem" }}>
            <input
              value={it.label || ""}
              onChange={(e) => {
                const next = items.map((x: ListItem, idx: number) =>
                  idx === i ? { ...x, label: e.target.value } : x,
                );
                update("items", next);
              }}
              style={{
                border: "none",
                background: "transparent",
                font: "inherit",
                width: "100%",
              }}
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
    const items: AttributeItem[] = state.items || content.items || [];
    return (
      <dl className="atribute-list">
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
                style={{
                  border: "none",
                  background: "transparent",
                  font: "inherit",
                }}
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
                style={{
                  border: "none",
                  background: "transparent",
                  font: "inherit",
                  width: "100%",
                }}
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

  return <div>Unsupported content type for editing: {content.type}</div>;
}
