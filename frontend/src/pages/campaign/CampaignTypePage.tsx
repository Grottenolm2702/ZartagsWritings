import React from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { useJWTAuth } from "../../context/JWTAuthContext";
import { apiFetch } from "../../lib/api";
import type { ApiCampaign, ApiEntity, ApiEntityType } from "../../types/campaign-api";
import contentStyles from "../../styles/content.module.css";
import CampaignDetail from "../../components/campaign/CampaignDetail";

const TYPE_LABELS: Record<ApiEntityType, string> = {
  pc: "Player Characters",
  npc: "NPCs",
  magicitem: "Magic Items",
  location: "Locations",
};

export default function CampaignTypePage() {
  const { slug, type, entitySlug } = useParams();
  const { user } = useJWTAuth();
  const campaignSlug = slug;
  const apiType = (type || "pc").toLowerCase() as ApiEntityType;
  const [campaign, setCampaign] = React.useState<ApiCampaign | null>(null);
  const [entities, setEntities] = React.useState<ApiEntity[]>([]);
  const [entity, setEntity] = React.useState<ApiEntity | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (!campaignSlug) {
          throw new Error("Campaign slug is missing");
        }
        const campaignData = await apiFetch<ApiCampaign>(`/api/campaigns/${campaignSlug}`);
        if (mounted) setCampaign(campaignData);
        if (entitySlug) {
          const data = await apiFetch<ApiEntity>(
            `/api/campaigns/${campaignSlug}/entities/${apiType}/${entitySlug}`,
          );
          if (mounted) setEntity(data);
        } else {
          const data = await apiFetch<ApiEntity[]>(
            `/api/campaigns/${campaignSlug}/entities/${apiType}`,
          );
          if (mounted) setEntities(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Daten konnten nicht geladen werden");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [campaignSlug, apiType, entitySlug]);

  const currentMembership = campaign?.members.find((member) => member.userId === user?.id);
  const editable =
    campaign?.owner?.id === user?.id ||
    currentMembership?.role === "DM" ||
    currentMembership?.role === "EDITOR";

  if (!Object.prototype.hasOwnProperty.call(TYPE_LABELS, apiType)) {
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
      <main>
        {!entity ? (
          <header className={contentStyles.campaignTypeHeader}>
            <h1 className={contentStyles.campaignTypeTitle}>{TYPE_LABELS[apiType]}</h1>
            <div className={contentStyles.campaignTypeHeaderActions}>
              {editable ? (
                <Link
                  className={contentStyles.actionButton}
                  to={`/campaigns/${campaignSlug}/${apiType}/new`}
                >
                  Neue Entity
                </Link>
              ) : null}
            </div>
          </header>
        ) : null}

        {loading ? <p>Loading...</p> : null}
        {error ? <div className={contentStyles.errorMessage} role="alert">{error}</div> : null}

        {entity ? (
          <section className={contentStyles.campaignTypeSection}>
            <CampaignDetail
              key={`${campaignSlug}:${apiType}:${entity.id}`}
              campaignSlug={campaignSlug || ""}
              entityType={apiType}
              entity={entity}
              editable={!!editable}
            />
          </section>
        ) : (
          <section className={contentStyles.campaignTypeSection}>
            <div className={contentStyles.itemsGrid}>
              <div className={contentStyles.itemsMasonry}>
                {entities.map((entry) => (
                  <article key={entry.id} className={contentStyles.itemCard}>
                    <h2>{entry.name}</h2>
                    <p>{entry.summary || "No description"}</p>
                    <div className={contentStyles.campaignTypeEntityActions}>
                      <Link to={`/campaigns/${campaignSlug}/${apiType}/${entry.slug}`}>
                        Open
                      </Link>
                      {editable ? (
                        <Link to={`/campaigns/${campaignSlug}/${apiType}/${entry.slug}/edit`}>
                          Edit
                        </Link>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
            {!loading && entities.length === 0 ? <p>No entries found.</p> : null}
          </section>
        )}
      </main>
    </Layout>
  );
}
