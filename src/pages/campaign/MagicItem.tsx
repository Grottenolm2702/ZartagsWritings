import React from "react";
import Layout from "../../components/Layout";
import CampaignDetail from "../../components/campaign/CampaignDetail";
import type { HeaderField } from "../../components/campaign/ContentHeader";
import type { CardSpec } from "../../components/campaign/ItemsGrid";

export function createCampaignPage(
  title: string,
  defaultHeader?: HeaderField[],
  defaultCards?: CardSpec[]
) {
  return function CampaignPage({
    headerFields,
    cards,
  }: {
    headerFields?: HeaderField[];
    cards?: CardSpec[];
  }) {
    const hf = headerFields ?? defaultHeader ?? [];
    const cs = cards ?? defaultCards ?? [];
    return (
      <Layout>
        <CampaignDetail title={title} headerFields={hf} cards={cs} />
      </Layout>
    );
  };
}

const defaultHeader: HeaderField[] = [
  { label: "Name:", value: "Die Unendliche Geschichte" },
  { label: "Type:", value: "Book" },
  { label: "Weight:", value: "???" },
  { label: "Cost:", value: "???" },
  { label: "Quantity:", value: "1" },
];

const defaultCards: CardSpec[] = [
  {
    title: "Magical Attributes",
    content: (
      <dl className="attribute-list">
        <dt>School:</dt>
        <dd>Abduration</dd>
        <dt>Attunement:</dt>
        <dd>None</dd>
      </dl>
    ),
  },
  {
    title: "Effect",
    content: (
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
    ),
  },
  {
    title: "Picture",
    pictureSrc:
      "https://img.freepik.com/free-vector/book-magic-spells-witchcraft_105738-781.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    title: "General Notes",
    content: (
      <p>
        Misc notes. Replace with backend content when available.
      </p>
    ),
    wide: true,
  },
];

export default createCampaignPage("Magic Item", defaultHeader, defaultCards);
