import React from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { useJWTAuth } from "../../context/JWTAuthContext";
import { apiFetch } from "../../lib/api";
import type { ApiCampaign } from "../../types/campaign-api";
import contentStyles from "../../styles/content.module.css";

export default function ManageCampaign() {
  const { slug } = useParams();
  const campaignSlug = slug;
  const { user } = useJWTAuth();
  const [campaign, setCampaign] = React.useState<ApiCampaign | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (!campaignSlug) {
          throw new Error("Campaign-Slug fehlt");
        }
        const data = await apiFetch<ApiCampaign>(`/api/campaigns/${campaignSlug}`);
        if (mounted) setCampaign(data);
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Campaign konnte nicht geladen werden");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [campaignSlug]);

  const currentMembership = campaign?.members.find((member) => member.userId === user?.id);
  const canEdit =
    campaign?.owner?.id === user?.id ||
    currentMembership?.role === "DM" ||
    currentMembership?.role === "EDITOR";

  async function updateRole(memberUserId: number, role: "DM" | "EDITOR" | "PLAYER") {
    const updated = await apiFetch<{
      role: "DM" | "EDITOR" | "PLAYER";
      displayName?: string | null;
    }>(`/api/campaigns/${campaignSlug}/members/${memberUserId}`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    setCampaign((prev) =>
      prev
        ? {
            ...prev,
            members: prev.members.map((member) =>
              member.userId === memberUserId
                ? { ...member, role: updated.role, displayName: updated.displayName }
                : member,
            ),
          }
        : prev,
    );
  }

  return (
    <Layout>
      <main>
        <h1>Campaign verwalten</h1>
        {loading ? <p>Lädt...</p> : null}
        {error ? <div className={contentStyles.errorMessage}>{error}</div> : null}

        {campaign ? (
          <>
            <p>
              <strong>{campaign.name}</strong>
            </p>
            <p>
              Invite Code: <code>{campaign.joinCode}</code>
            </p>
            <p>
              Invite Link:{" "}
              <code>{`${window.location.origin}/campaigns/${campaign.slug}/overview`}</code>
            </p>
            <p>
              <Link className={contentStyles.actionButton} to={`/campaigns/${campaign.slug}/overview`}>
                Zur Übersicht
              </Link>
            </p>

            <h2>Mitglieder</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {campaign.members.map((member) => (
                <li key={member.id} style={{ marginBottom: 12 }}>
                  <strong>{member.displayName || member.user.name || member.user.email}</strong>{" "}
                  <span style={{ opacity: 0.75 }}>({member.role})</span>
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <button
                      className={contentStyles.actionButton}
                      onClick={() => navigator.clipboard?.writeText(campaign.joinCode)}
                    >
                      Code kopieren
                    </button>
                    {canEdit ? (
                      <>
                        <button
                          className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
                          onClick={() => updateRole(member.userId, "PLAYER")}
                        >
                          Player
                        </button>
                        <button
                          className={contentStyles.actionButton}
                          onClick={() => updateRole(member.userId, "EDITOR")}
                        >
                          Editor
                        </button>
                        <button
                          className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
                          onClick={() => updateRole(member.userId, "DM")}
                        >
                          DM
                        </button>
                      </>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </main>
    </Layout>
  );
}
