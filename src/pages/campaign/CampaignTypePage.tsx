import React from "react";
import { useParams, useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import CampaignDetail from "../../components/campaign/CampaignDetail";
import {
  PC_EXAMPLE,
  NPC_EXAMPLE,
  MAGICITEM_EXAMPLE,
  LOCATION_EXAMPLE,
} from "../../data/exampleData";
import { useAuth } from "../../context/AuthContext";

const MAP: Record<string, { header: any; cards: any[]; title?: string }> = {
  pc: {
    header: PC_EXAMPLE.header,
    cards: PC_EXAMPLE.cards,
    title: PC_EXAMPLE.header?.[0]?.value || "Player Character",
  },
  npc: {
    header: NPC_EXAMPLE.header,
    cards: NPC_EXAMPLE.cards,
    title: NPC_EXAMPLE.header?.[0]?.value || "Non Playable Character",
  },
  magicitem: {
    header: MAGICITEM_EXAMPLE.header,
    cards: MAGICITEM_EXAMPLE.cards,
    title: MAGICITEM_EXAMPLE.header?.[0]?.value || "Magic Item",
  },
  location: {
    header: LOCATION_EXAMPLE.header,
    cards: LOCATION_EXAMPLE.cards,
    title: LOCATION_EXAMPLE.header?.[0]?.value || "Location",
  },
};

export default function CampaignTypePage() {
  const { type } = useParams();
  const key = (type || "").toLowerCase();
  const location = useLocation();
  const state = (location && (location.state as any)) || {};
  const auth = (() => {
    try {
      return useAuth();
    } catch {
      return {
        isEditor: false,
        setIsEditor: (_: boolean) => {},
        toggleEditor: () => {},
      } as any;
    }
  })();

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
