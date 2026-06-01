import React from "react";
import { useParams, useLocation, Location } from "react-router-dom";
import Layout from "../../components/Layout";
import CampaignDetail from "../../components/campaign/CampaignDetail";
import raw from "../../data/exampleData.json";
import { useAuthSafe } from "../../context/AuthContext";
import type {
  RawData,
  HeaderField,
  CardSpec,
  NavigationState,
  CampaignType,
  CAMPAIGN_TYPE_LABELS,
} from "../../types/campaign";

interface CampaignTypeConfig {
  header: HeaderField[];
  cards: CardSpec[];
  title?: string;
}

const MAP: Record<string, CampaignTypeConfig> = {
  pc: {
    header: (raw as RawData).pc.header,
    cards: (raw as RawData).pc.cards,
    title: (raw as RawData).pc.header?.[0]?.value || CAMPAIGN_TYPE_LABELS.pc,
  },
  npc: {
    header: (raw as RawData).npc.header,
    cards: (raw as RawData).npc.cards,
    title: (raw as RawData).npc.header?.[0]?.value || CAMPAIGN_TYPE_LABELS.npc,
  },
  magicitem: {
    header: (raw as RawData).magicItem.header,
    cards: (raw as RawData).magicItem.cards,
    title:
      (raw as RawData).magicItem.header?.[0]?.value ||
      CAMPAIGN_TYPE_LABELS.magicitem,
  },
  location: {
    header: (raw as RawData).location.header,
    cards: (raw as RawData).location.cards,
    title:
      (raw as RawData).location.header?.[0]?.value ||
      CAMPAIGN_TYPE_LABELS.location,
  },
};

export default function CampaignTypePage() {
  const { type } = useParams();
  const key = (type || "").toLowerCase();
  const location = useLocation() as Location<NavigationState>;
  const state = (location?.state as NavigationState) || {};
  const auth = useAuthSafe();

  const data = MAP[key];
  const headerFields = state?.header || data?.header;
  const cards = state?.cards || data?.cards;

  React.useEffect(() => {
    if (state?.newDraft) {
      try {
        auth.setIsEditor(true);
      } catch {}
    }
  }, [state?.newDraft, auth]);

  if (!data) {
    return (
      <Layout>
        <main>
          <h1>Campaign</h1>
          <p>Unknown campaign type: {type}</p>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <CampaignDetail
        title={data.title}
        headerFields={headerFields}
        cards={cards}
        type={key as CampaignType}
      />
    </Layout>
  );
}
