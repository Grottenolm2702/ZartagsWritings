import React from "react";
import contentStyles from "../../styles/content.module.css";
import { Link } from "react-router-dom";
import type { ApiCardContent } from "../../types/campaign-api";
import EditableCardContent from "./EditableCardContent";

type CardContentProps = {
  content?: ApiCardContent;
  editable?: boolean;
  onChange?: (content: ApiCardContent) => void;
};

function getInternalRoute(href: string): string | null {
  const trimmed = href.trim();
  if (!trimmed) return null;

  try {
    const resolvedUrl = new URL(trimmed, window.location.origin);
    if (resolvedUrl.origin !== window.location.origin) {
      return null;
    }

    return `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
  } catch {
    return trimmed.startsWith("/") ? trimmed : null;
  }
}

function ListLink({ href, children }: { href: string; children: React.ReactNode }) {
  const internalRoute = getInternalRoute(href);
  if (internalRoute) {
    return <Link to={internalRoute}>{children}</Link>;
  }

  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

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
            {item.href ? <ListLink href={item.href}>{item.label}</ListLink> : item.label}
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
