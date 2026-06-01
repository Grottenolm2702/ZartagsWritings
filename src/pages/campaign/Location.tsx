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
  { label: "Name:", value: "Das Herrenhaus" },
  { label: "Type:", value: "House" },
];

const defaultCards: CardSpec[] = [
  {
    title: "Short Description",
    content: (
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
    ),
  },
  {
    title: "Related Places",
    content: (
      <ul>
        <li><a href="#">Garten</a></li>
        <li><a href="#">Keller</a></li>
        <li><a href="#">Küche</a></li>
      </ul>
    ),
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

export default createCampaignPage("Location", defaultHeader, defaultCards);
