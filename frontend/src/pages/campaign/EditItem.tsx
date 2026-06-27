import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { useJWTAuth } from "../../context/JWTAuthContext";
import { apiFetch } from "../../lib/api";
import type {
  ApiCampaign,
  ApiEntity,
  ApiEntityTemplate,
  ApiEntityType,
} from "../../types/campaign-api";
import CampaignDetail from "../../components/campaign/CampaignDetail";

export default function EditItemPage() {
  const { slug, type, entitySlug } = useParams();
  const { user } = useJWTAuth();
  const campaignSlug = slug;
  const apiType = (type || "pc").toLowerCase() as ApiEntityType;
  const isNew = entitySlug === "new" || !entitySlug;

  const [campaign, setCampaign] = React.useState<ApiCampaign | null>(null);
  const [entity, setEntity] = React.useState<ApiEntity | null>(null);
  const [template, setTemplate] = React.useState<ApiEntityTemplate | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function load() {
      if (!campaignSlug) {
        setError("Campaign-Slug fehlt");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const requests = [
          apiFetch<ApiCampaign>(`/api/campaigns/${campaignSlug}`),
          isNew
            ? Promise.resolve(null)
            : apiFetch<ApiEntity>(
                `/api/campaigns/${campaignSlug}/entities/${apiType}/${entitySlug}`,
              ),
          isNew
            ? apiFetch<ApiEntityTemplate>(
                `/api/campaigns/${campaignSlug}/entities/${apiType}/template`,
              )
            : Promise.resolve(null),
        ] as const;
        const [campaignData, entityData, templateData] = await Promise.all(requests);
        if (mounted) {
          setCampaign(campaignData);
          setEntity(entityData);
          setTemplate(templateData);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Entity konnte nicht geladen werden");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [apiType, campaignSlug, entitySlug, isNew]);

  const currentMembership = campaign?.members.find((membership) => membership.userId === user?.id);
  const hasEditAccess =
    campaign?.owner?.id === user?.id ||
    currentMembership?.role === "DM" ||
    currentMembership?.role === "EDITOR" ||
    false;

  return (
    <Layout>
      <main>
        {loading ? <p>Lädt...</p> : null}
        {error ? <div>{error}</div> : null}
        {campaignSlug && (isNew || entity) ? (
          <CampaignDetail
            campaignSlug={campaignSlug}
            entityType={apiType}
            entity={entity}
            template={template}
            editable={hasEditAccess}
            isNew={isNew}
          />
        ) : null}
      </main>
    </Layout>
  );
}
