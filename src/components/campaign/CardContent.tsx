import React from "react";
import EditableCardContent from "./EditableCardContent";
import { useAuthSafe } from "../../context/AuthContext";
import type { CardContent as CardContentType, ListItem } from "../../types/campaign";

interface CardContentProps {
  content?: CardContentType;
  onChange?: (c: CardContentType) => void;
}

export default function CardContent({
  content,
  onChange,
}: CardContentProps) {
  const auth = useAuthSafe();

  if (!content) return null;

  const editableTypes = ["paragraph", "paragraphs", "list", "attributes"];
  if (auth.isEditor && editableTypes.includes(content.type)) {
    return <EditableCardContent content={content} onChange={onChange} />;
  }

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
        {content.items.map((it: ListItem, i: number) => (
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
        {content.items.map((it, i: number) => (
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
