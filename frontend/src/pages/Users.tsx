import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import contentStyles from "../styles/content.module.css";
import { useJWTAuth, getErrorMessage } from "../context/JWTAuthContext";

export default function Users() {
  const navigate = useNavigate();
  const { user, loading, error, loadUser, logout } = useJWTAuth();

  React.useEffect(() => {
    loadUser();
  }, [loadUser]);

  async function handleDelete() {
    if (!confirm("Account wirklich löschen?")) return;
    try {
      const res = await fetch("/api/user", {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(getErrorMessage(await res.text()));
      await logout();
      navigate("/");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <Layout>
      <main className={contentStyles.userPage}>
        <h1>Userverwaltung</h1>
        <p className={contentStyles.userIntro}>
          Hier findest du deine Kontodaten, deine Campaign-Mitgliedschaften und
          die wichtigsten Kontoeinstellungen.
        </p>
        {error ? <div className={contentStyles.errorMessage}>{error}</div> : null}
        {loading ? <p>Lädt...</p> : null}
        {user ? (
          <div className={contentStyles.userCard}>
            <div className={contentStyles.userMetaGrid}>
              <div className={contentStyles.userMetaItem}>
                <span className={contentStyles.userMetaLabel}>ID</span>
                <span className={contentStyles.userMetaValue}>{user.id}</span>
              </div>
              <div className={contentStyles.userMetaItem}>
                <span className={contentStyles.userMetaLabel}>E-Mail</span>
                <span className={contentStyles.userMetaValue}>{user.email}</span>
              </div>
              <div className={contentStyles.userMetaItem}>
                <span className={contentStyles.userMetaLabel}>Name</span>
                <span className={contentStyles.userMetaValue}>{user.name || "-"}</span>
              </div>
            </div>

            {user.memberships?.length ? (
              <div className={contentStyles.userSection}>
                <h2 className={contentStyles.userSectionTitle}>Campaigns</h2>
                <ul className={contentStyles.userCampaignList}>
                  {user.memberships.map((membership) => (
                    <li key={membership.id} className={contentStyles.userCampaignItem}>
                      <Link to={`/campaigns/${membership.campaign.slug}/overview`}>
                        {membership.campaign.name}
                      </Link>
                      <span className={contentStyles.userCampaignRole}>{membership.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className={contentStyles.userSection}>
                <h2 className={contentStyles.userSectionTitle}>Campaigns</h2>
                <p className={contentStyles.userEmptyState}>Du bist aktuell keiner Campaign zugeordnet.</p>
              </div>
            )}

            <div className={contentStyles.userActions}>
              <button
                className={`${contentStyles.actionButton} ${contentStyles.dangerButton}`}
                onClick={handleDelete}
              >
                Account löschen
              </button>
              <button className={contentStyles.actionButton} onClick={handleLogout}>
                Abmelden
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </Layout>
  );
}
