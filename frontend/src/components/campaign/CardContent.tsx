import React from "react";
import contentStyles from "../../styles/content.module.css";
import type { ApiCardContent } from "../../types/campaign-api";
import EditableCardContent from "./EditableCardContent";

type CardContentProps = {
  content?: ApiCardContent;
  editable?: boolean;
  onChange?: (content: ApiCardContent) => void;
};

export default function CardContent({ content, editable, onChange }: CardContentProps) {
  if (!content) return null;

  if (editable) {
    return <EditableCardContent content={content} onChange={onChange} />;
  }

  if (content.type === "paragraph") {
    return <p>{content.text}</p>;
  }

  if (content.type === "paragraphs") {
    return (
      <>
        {content.paragraphs.map((paragraph, index) => (
          <p key={`${index}-${paragraph}`}>{paragraph}</p>
        ))}
      </>
    );
  }

  if (content.type === "list") {
    return (
      <ul>
        {content.items.map((item, index) => (
          <li key={`${index}-${item.label}`}>
            {item.href ? <a href={item.href}>{item.label}</a> : item.label}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <dl className={contentStyles.atributeList}>
      {content.items.map((item, index) => (
        <React.Fragment key={`${index}-${item.dt}`}>
          <dt>{item.dt}</dt>
          <dd>{item.dd}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
