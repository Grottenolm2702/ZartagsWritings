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
          throw new Error("Campaign slug is missing");
        }
        const data = await apiFetch<ApiCampaign>(`/api/campaigns/${campaignSlug}`);
        if (mounted) setCampaign(data);
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load campaign");
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
  const canManage =
    campaign?.owner?.id === user?.id ||
    currentMembership?.role === "DM";

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

  function roleButtonClass(memberRole: "DM" | "EDITOR" | "PLAYER", role: "DM" | "EDITOR" | "PLAYER") {
    return memberRole === role
      ? contentStyles.actionButton
      : `${contentStyles.actionButton} ${contentStyles.secondary}`;
  }

  return (
    <Layout>
      <main className={contentStyles.managePage}>
        <h1>Manage campaign</h1>
        <p className={contentStyles.manageIntro}>
          Manage members and access roles for this campaign.
        </p>
        {loading ? <p>Loading...</p> : null}
        {error ? <div className={contentStyles.errorMessage} role="alert">{error}</div> : null}

        {campaign ? (
          <section className={contentStyles.manageCard} aria-label="Campaign Verwaltung">
            <section className={contentStyles.manageSummary} aria-label="Campaign Details">
              <article>
                <span className={contentStyles.manageLabel}>Campaign</span>
                <strong className={contentStyles.manageValue}>{campaign.name}</strong>
              </article>
              <article>
                <span className={contentStyles.manageLabel}>Code</span>
                <div className={contentStyles.manageCodeRow}>
                  <code className={contentStyles.manageCode}>{campaign.joinCode}</code>
                  <button
                    className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
                    onClick={() => navigator.clipboard?.writeText(campaign.joinCode)}
                    aria-label="Beitrittscode kopieren"
                  >
                    Code kopieren
                  </button>
                  {canManage ? (
                    <button
                      className={contentStyles.iconButton}
                      title="Neuen Beitrittscode generieren"
                      aria-label="Neuen Beitrittscode generieren"
                      onClick={async () => {
                        try {
                          const resp = await apiFetch<{ joinCode: string }>(
                            `/api/campaigns/${campaign.slug}/regenerate-join-code`,
                            { method: "POST" },
                          );
                          setCampaign((prev) => (prev ? { ...prev, joinCode: resp.joinCode } : prev));
                          navigator.clipboard?.writeText(resp.joinCode);
                        } catch (err) {
                          setError(err instanceof Error ? err.message : "Failed to generate join code");
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
                  ) : null}
                </div>
              </article>
              <div className={contentStyles.manageActions}>
                <Link
                  className={contentStyles.actionButton}
                  to={`/campaigns/${campaign.slug}/overview`}
                >
                  Back to overview
                </Link>
              </div>
            </section>

            <section className={contentStyles.userSection} aria-label="Members">
              <h2 className={contentStyles.userSectionTitle}>Members</h2>
              <ul className={contentStyles.manageMemberList}>
              {campaign.members.map((member) => (
                <li key={member.id} className={contentStyles.manageMemberItem}>
                  <div className={contentStyles.manageMemberHeader}>
                    <strong>
                      {member.displayName || member.user.name || member.user.email}
                      {campaign.owner?.id === member.userId ? " (Owner)" : ""}
                    </strong>
                  </div>
                  {canManage ? (
                    <div className={contentStyles.manageRoleButtons} role="group" aria-label={`Role for ${member.displayName || member.user.name || member.user.email}`}>
                      <button
                        className={roleButtonClass(member.role, "PLAYER")}
                        onClick={() => updateRole(member.userId, "PLAYER")}
                      >
                        Player
                      </button>
                      <button
                        className={roleButtonClass(member.role, "EDITOR")}
                        onClick={() => updateRole(member.userId, "EDITOR")}
                      >
                        Editor
                      </button>
                      <button
                        className={roleButtonClass(member.role, "DM")}
                        onClick={() => updateRole(member.userId, "DM")}
                      >
                        DM
                      </button>
                    </div>
                  ) : null}
                </li>
              ))}
              </ul>
            </section>
          </section>
        ) : null}
      </main>
    </Layout>
  );
}
