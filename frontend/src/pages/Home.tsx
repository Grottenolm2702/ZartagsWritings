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
      if (!isLoggedIn) {
        setCampaigns([]);
        setShowJoin(false);
        setJoinCode("");
        setJoinError(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<ApiCampaignSummary[]>("/api/campaigns");
        if (mounted) setCampaigns(data);
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load campaigns");
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
      setJoinError(err instanceof Error ? err.message : "Failed to join campaign");
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
            Please <Link className={contentStyles.inlineLink} to="/login">log in</Link> or <Link className={contentStyles.inlineLink} to="/register">register</Link> to see your campaigns.
          </p>
        ) : (
          <div className={contentStyles.homeJoinActions}>
            <Link className={contentStyles.actionButton} to="/campaigns/new">
              Create campaign
            </Link>
            <button
              type="button"
              className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
              onClick={() => setShowJoin(true)}
            >
              Join campaign
            </button>
          </div>
        )}

        {showJoin ? (
          <div className={contentStyles.modalOverlay}>
            <div
              className={contentStyles.modal}
              role="dialog"
              aria-modal="true"
              aria-labelledby="join-campaign-title"
            >
              <h3 id="join-campaign-title">Join campaign</h3>
              <form onSubmit={handleJoinSubmit}>
                <label htmlFor="joinCode">Join code</label>
                <input
                  id="joinCode"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  required
                  autoComplete="off"
                />
                <div className={contentStyles.homeJoinButtonRow}>
                  <button type="submit" className={contentStyles.actionButton} disabled={joinLoading}>
                    {joinLoading ? "Joining..." : "Join"}
                  </button>
                  <button
                    type="button"
                    className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
                    onClick={() => {
                      setShowJoin(false);
                      setJoinError(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
                {joinError ? <div className={contentStyles.errorMessage} role="alert">{joinError}</div> : null}
              </form>
            </div>
          </div>
        ) : null}

        {loading ? <p>Loading...</p> : null}
        {error ? <div className={contentStyles.errorMessage} role="alert">{error}</div> : null}

        {isLoggedIn && campaigns.length > 0 ? (
          <section className={contentStyles.itemsGrid}>
            <div className={contentStyles.itemsMasonry}>
              {campaigns.map((campaign) => (
                <article key={campaign.id} className={contentStyles.campaignCard}>
                  <Link to={`/campaigns/${campaign.slug}/overview`}>
                    <h2>{campaign.name}</h2>
                    <p>{campaign.description || "No description"}</p>
                    <p>Role: {campaign.role}</p>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ) : isLoggedIn && !loading ? (
          <section className={contentStyles.emptyStateCard} aria-label="No campaigns yet">
            <h2 className={contentStyles.emptyStateTitle}>No campaigns yet</h2>
            <p className={contentStyles.emptyStateText}>
              Create a new campaign or join an existing one with a join code.
            </p>
            <div className={contentStyles.emptyStateActions}>
              <Link className={contentStyles.actionButton} to="/campaigns/new">
                Create campaign
              </Link>
              <button
                type="button"
                className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
                onClick={() => setShowJoin(true)}
              >
                Join campaign
              </button>
            </div>
          </section>
        ) : null}
      </main>
    </Layout>
  );
}
