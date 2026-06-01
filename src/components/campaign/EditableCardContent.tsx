import React from "react";

export default function EditableCardContent({ content, onChange }: { content?: any; onChange?: (c: any) => void }) {
  const [state, setState] = React.useState<any>(content || {});

  React.useEffect(() => setState(content || {}), [content]);

  if (!content) return null;

  function update(path: string, value: any) {
    setState((s: any) => {
      const copy = { ...s };
      copy[path] = value;
      // notify parent
      try {
        onChange && onChange(copy);
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
    const items = state.items || content.items || [];
    return (
      <ul>
        {items.map((it: any, i: number) => (
          <li key={i} style={{ marginBottom: "0.25rem" }}>
            <input
              value={it.label || ""}
              onChange={(e) => {
                const next = items.map((x: any, idx: number) => (idx === i ? { ...x, label: e.target.value } : x));
                update("items", next);
              }}
              style={{ border: "none", background: "transparent", font: "inherit", width: "100%" }}
            />
          </li>
        ))}
        <li>
          <button onClick={() => update("items", [...items, { label: "" }])} type="button">
            Add item
          </button>
        </li>
      </ul>
    );
  }

  if (content.type === "attributes") {
    const items = state.items || content.items || [];
    return (
      <dl className="atribute-list">
        {items.map((it: any, i: number) => (
          <React.Fragment key={i}>
            <dt>
              <input
                value={it.dt || ""}
                onChange={(e) => {
                  const next = items.map((x: any, idx: number) => (idx === i ? { ...x, dt: e.target.value } : x));
                  update("items", next);
                }}
                style={{ border: "none", background: "transparent", font: "inherit" }}
              />
            </dt>
            <dd>
              <input
                value={it.dd || ""}
                onChange={(e) => {
                  const next = items.map((x: any, idx: number) => (idx === i ? { ...x, dd: e.target.value } : x));
                  update("items", next);
                }}
                style={{ border: "none", background: "transparent", font: "inherit", width: "100%" }}
              />
            </dd>
          </React.Fragment>
        ))}
        <div>
          <button onClick={() => update("items", [...items, { dt: "", dd: "" }])} type="button">
            Add attribute
          </button>
        </div>
      </dl>
    );
  }

  return <div>Unsupported content type for editing: {content.type}</div>;
}
