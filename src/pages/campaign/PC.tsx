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
  { label: "Name:", value: "Melissa" },
  { label: "Class:", value: "Fighter" },
  { label: "Race:", value: "Tiefling" },
];

const defaultCards: CardSpec[] = [
  {
    title: "Short Description",
    content: (
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
    ),
  },
  {
    title: "Backstory",
    content: (
      <p>
        Character backstory content here. Replace with backend content when
        available.
      </p>
    ),
  },
  {
    title: "Picture",
    pictureSrc:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.PIOJ1VrKV0mux7r68o6BjgHaHa%3Fpid%3DApi&f=1&ipt=8db0a96b75aec1cad70144c59e25e2a048a04e4ee38832ea092bb35c6b2a98d2&ipo=images",
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

export default createCampaignPage("Player Character", defaultHeader, defaultCards);
