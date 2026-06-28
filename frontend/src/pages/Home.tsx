import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useJWTAuth } from "../context/JWTAuthContext";
import { apiFetch } from "../lib/api";
import type { ApiCampaignSummary } from "../types/campaign-api";
import contentStyles from "../styles/content.module.css";

export default function Home() {
  const { isLoggedIn } = useJWTAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = React.useState<ApiCampaignSummary[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showJoin, setShowJoin] = React.useState(false);
  const [joinCode, setJoinCode] = React.useState("");
  const [joinLoading, setJoinLoading] = React.useState(false);
  const [joinError, setJoinError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function load() {
      if (!isLoggedIn) return;
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<ApiCampaignSummary[]>("/api/campaigns");
        if (mounted) setCampaigns(data);
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Kampagnen konnten nicht geladen werden");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [isLoggedIn]);

  async function handleJoinSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setJoinLoading(true);
    setJoinError(null);
    try {
      const result = await apiFetch<{ campaign: { slug: string } }>("/api/campaigns/join", {
        method: "POST",
        body: JSON.stringify({ joinCode }),
      });
      setShowJoin(false);
      setJoinCode("");
      navigate(`/campaigns/${result.campaign.slug}/overview`);
    } catch (err) {
      setJoinError(err instanceof Error ? err.message : "Campaign konnte nicht beigetreten werden");
    } finally {
      setJoinLoading(false);
    }
  }

  return (
    <Layout>
      <main>
        <h1>Zartags Writings</h1>

        {!isLoggedIn ? (
          <p>
            Bitte <Link to="/login">einloggen</Link> oder{" "}
            <Link to="/register">registrieren</Link>, um deine Campaigns zu sehen.
          </p>
        ) : (
          <p className={contentStyles.homeJoinActions}>
            <Link className={contentStyles.actionButton} to="/campaigns/new">
              Campaign erstellen
            </Link>
            <button
              type="button"
              className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
              onClick={() => setShowJoin(true)}
            >
              Campaign beitreten
            </button>
          </p>
        )}

        {showJoin ? (
          <div className={contentStyles.modalOverlay}>
            <div className={contentStyles.modal} role="dialog" aria-modal="true">
              <h3>Campaign beitreten</h3>
              <form onSubmit={handleJoinSubmit}>
                <label htmlFor="joinCode">Beitrittscode</label>
                <input
                  id="joinCode"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  required
                  autoComplete="off"
                />
                <div className={contentStyles.homeJoinButtonRow}>
                  <button type="submit" className={contentStyles.actionButton} disabled={joinLoading}>
                    {joinLoading ? "Beitreten..." : "Beitreten"}
                  </button>
                  <button
                    type="button"
                    className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
                    onClick={() => {
                      setShowJoin(false);
                      setJoinError(null);
                    }}
                  >
                    Abbrechen
                  </button>
                </div>
                {joinError ? <div className={contentStyles.errorMessage}>{joinError}</div> : null}
              </form>
            </div>
          </div>
        ) : null}

        {loading ? <p>Lädt...</p> : null}
        {error ? <div className={contentStyles.errorMessage}>{error}</div> : null}

        {campaigns.length > 0 ? (
          <section className={contentStyles.itemsGrid}>
            <div className={contentStyles.itemsMasonry}>
              {campaigns.map((campaign) => (
                <article key={campaign.id} className={contentStyles.campaignCard}>
                  <Link to={`/campaigns/${campaign.slug}/overview`}>
                    <h2>{campaign.name}</h2>
                    <p>{campaign.description || "Keine Beschreibung"}</p>
                    <p>Rolle: {campaign.role}</p>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ) : isLoggedIn && !loading ? (
          <p>Keine Campaigns gefunden.</p>
        ) : null}
      </main>
    </Layout>
  );
}
