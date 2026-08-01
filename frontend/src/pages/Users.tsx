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
    if (!confirm("Do you really want to delete your account?")) return;
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
        <h1>User account</h1>
        <p className={contentStyles.userIntro}>
          Here you can find your account details, campaign memberships, and key
          account settings.
        </p>
        {error ? (
          <div className={contentStyles.errorMessage} role="alert">
            {error}
          </div>
        ) : null}
        {loading ? <p>Loading...</p> : null}
        {user ? (
          <section
            className={contentStyles.userCard}
            aria-label="Account details"
          >
            <dl className={contentStyles.userMetaGrid}>
              <div className={contentStyles.userMetaItem}>
                <dt className={contentStyles.userMetaLabel}>ID</dt>
                <dd className={contentStyles.userMetaValue}>{user.id}</dd>
              </div>
              <div className={contentStyles.userMetaItem}>
                <dt className={contentStyles.userMetaLabel}>E-Mail</dt>
                <dd className={contentStyles.userMetaValue}>{user.email}</dd>
              </div>
              <div className={contentStyles.userMetaItem}>
                <dt className={contentStyles.userMetaLabel}>Name</dt>
                <dd className={contentStyles.userMetaValue}>
                  {user.name || "-"}
                </dd>
              </div>
            </dl>

            {user.memberships?.length ? (
              <div className={contentStyles.userSection}>
                <h2 className={contentStyles.userSectionTitle}>Campaigns</h2>
                <ul className={contentStyles.userCampaignList}>
                  {user.memberships.map((membership) => (
                    <li
                      key={membership.id}
                      className={contentStyles.userCampaignItem}
                    >
                      <Link
                        to={`/campaigns/${membership.campaign.slug}/overview`}
                      >
                        {membership.campaign.name}
                      </Link>
                      <span className={contentStyles.userCampaignRole}>
                        {membership.role}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className={contentStyles.userSection}>
                <h2 className={contentStyles.userSectionTitle}>Campaigns</h2>
                <p className={contentStyles.userEmptyState}>
                  You are not part of any campaign yet.
                </p>
              </div>
            )}

            <div className={contentStyles.userActions}>
              <button
                className={`${contentStyles.actionButton} ${contentStyles.dangerButton}`}
                onClick={handleDelete}
              >
                Delete account
              </button>
              <button
                className={contentStyles.actionButton}
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          </section>
        ) : null}
      </main>
    </Layout>
  );
}
