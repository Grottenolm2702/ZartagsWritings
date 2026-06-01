import React from "react";
import ContentHeader, { HeaderField } from "./ContentHeader";
import ItemsGrid, { CardSpec } from "./ItemsGrid";

export default function CampaignDetail({
  title,
  headerFields,
  cards,
}: {
  title: string;
  headerFields?: HeaderField[];
  cards?: CardSpec[];
}) {
  return (
    <main>
      <h1>{title}</h1>
      {headerFields && <ContentHeader fields={headerFields} />}
      {cards && <ItemsGrid cards={cards} />}
    </main>
  );
}
