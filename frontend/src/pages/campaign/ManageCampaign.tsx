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
      <main className={contentStyles.managePage}>
        <h1>Campaign verwalten</h1>
        <p className={contentStyles.manageIntro}>
          Hier verwaltest du Mitglieder und Zugriffsrollen für diese Campaign.
        </p>
        {loading ? <p>Lädt...</p> : null}
        {error ? <div className={contentStyles.errorMessage}>{error}</div> : null}

        {campaign ? (
          <div className={contentStyles.manageCard}>
            <div className={contentStyles.manageSummary}>
              <div>
                <span className={contentStyles.manageLabel}>Campaign</span>
                <strong className={contentStyles.manageValue}>{campaign.name}</strong>
              </div>
              <div>
                <span className={contentStyles.manageLabel}>Code</span>
                <div className={contentStyles.manageCodeRow}>
                  <code className={contentStyles.manageCode}>{campaign.joinCode}</code>
                  <button
                    className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
                    onClick={() => navigator.clipboard?.writeText(campaign.joinCode)}
                  >
                    Code kopieren
                  </button>
                  <button
                    className={contentStyles.iconButton}
                    title="Neuen Beitrittscode generieren"
                    onClick={async () => {
                      try {
                        // optimistic UI: disable via attribute
                        const resp = await apiFetch<{ joinCode: string }>(
                          `/api/campaigns/${campaign.slug}/regenerate-join-code`,
                          { method: "POST" },
                        );
                        setCampaign((prev) => (prev ? { ...prev, joinCode: resp.joinCode } : prev));
                        // copy new code to clipboard
                        navigator.clipboard?.writeText(resp.joinCode);
                      } catch (err) {
                        // show simple error
                        setError(err instanceof Error ? err.message : "Fehler beim Generieren des Codes");
                      }
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path
                        d="M19 6V10H15"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 18V14H9M6 9A7.5 7.5 0 0 1 18.3 6.6M18 15A7.5 7.5 0 0 1 5.7 17.4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className={contentStyles.manageActions}>
                <Link
                  className={contentStyles.actionButton}
                  to={`/campaigns/${campaign.slug}/overview`}
                >
                  Zur Übersicht
                </Link>
              </div>
            </div>

            <div className={contentStyles.userSection}>
              <h2 className={contentStyles.userSectionTitle}>Mitglieder</h2>
              <ul className={contentStyles.manageMemberList}>
              {campaign.members.map((member) => (
                <li key={member.id} className={contentStyles.manageMemberItem}>
                  <div className={contentStyles.manageMemberHeader}>
                    <strong>{member.displayName || member.user.name || member.user.email}</strong>
                    <span className={contentStyles.manageMemberRole}>{member.role}</span>
                  </div>
                  {canEdit ? (
                    <div className={contentStyles.manageRoleButtons}>
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
                    </div>
                  ) : null}
                </li>
              ))}
              </ul>
            </div>
          </div>
        ) : null}
      </main>
    </Layout>
  );
}
