import React from "react";

export default function CardContent({ content }: { content?: any }) {
  if (!content) return null;

  if (content.type === "paragraphs") {
    return (
      <>
        {content.paragraphs.map((p: string, i: number) => (
          <p key={i}>{p}</p>
        ))}
      </>
    );
  }

  if (content.type === "paragraph") {
    return <p>{content.text}</p>;
  }

  if (content.type === "list") {
    return (
      <ul>
        {content.items.map((it: any, i: number) => (
          <li key={i}>
            {it.href ? <a href={it.href}>{it.label}</a> : it.label}
          </li>
        ))}
      </ul>
    );
  }

  if (content.type === "attributes") {
    return (
      <dl className={content.className || "attribute-list"}>
        {content.items.map((it: { dt: string; dd: string }, i: number) => (
          <React.Fragment key={i}>
            <dt>{it.dt}</dt>
            <dd>{it.dd}</dd>
          </React.Fragment>
        ))}
      </dl>
    );
  }

  return null;
}
