import React from "react";
import Layout from "../../components/Layout";
import CampaignDetail from "../../components/campaign/CampaignDetail";
import type { HeaderField } from "../../components/campaign/ContentHeader";
import type { CardSpec } from "../../components/campaign/ItemsGrid";
import raw from "../../data/exampleData.json";

export function createCampaignPage(
  title: string,
  defaultHeader?: HeaderField[],
  defaultCards?: CardSpec[],
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

export default createCampaignPage(
  "Location",
  (raw as any).location.header,
  (raw as any).location.cards,
);
