import React from "react";
import { useParams, useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import CampaignDetail from "../../components/campaign/CampaignDetail";
import raw from "../../data/exampleData.json";
import { useAuthSafe } from "../../context/AuthContext";

const MAP: Record<string, { header: any; cards: any[]; title?: string }> = {
  pc: {
    header: (raw as any).pc.header,
    cards: (raw as any).pc.cards,
    title: (raw as any).pc.header?.[0]?.value || "Player Character",
  },
  npc: {
    header: (raw as any).npc.header,
    cards: (raw as any).npc.cards,
    title: (raw as any).npc.header?.[0]?.value || "Non Playable Character",
  },
  magicitem: {
    header: (raw as any).magicItem.header,
    cards: (raw as any).magicItem.cards,
    title: (raw as any).magicItem.header?.[0]?.value || "Magic Item",
  },
  location: {
    header: (raw as any).location.header,
    cards: (raw as any).location.cards,
    title: (raw as any).location.header?.[0]?.value || "Location",
  },
};

export default function CampaignTypePage() {
  const { type } = useParams();
  const key = (type || "").toLowerCase();
  const location = useLocation();
  const state = (location && (location.state as any)) || {};
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
  }, [state?.newDraft]);

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
        type={key}
      />
    </Layout>
  );
}
