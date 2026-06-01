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
  { label: "Name:", value: "Zartag" },
  { label: "Class:", value: "Wizard" },
  { label: "Race:", value: "Half-Dwarf" },
  { label: "Occupation:", value: "Influencer" },
  { label: "Alignment:", value: "Chaotic Neutral" },
];

const defaultCards: CardSpec[] = [
  {
    title: "Short Description",
    content: (
      <p>
        Zartag is a half-dwarf wizard and the author of Robert's Mageikunde-
        Magazin. He travels frequently.
      </p>
    ),
  },
  {
    title: "Story Points",
    content: (
      <ul>
        <li>Zartag asks the party to escort him home (forest is dangerous)</li>
        <li>
          Zartag reveals the water is magically poisoned and points to the
          well as source.
        </li>
      </ul>
    ),
  },
  {
    title: "Picture",
    pictureSrc: "/src/media/Hero_screenshot.png",
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

export default createCampaignPage("Non Playable Character", defaultHeader, defaultCards);
