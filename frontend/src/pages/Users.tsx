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
      <main>
        <h1>Userverwaltung</h1>
        {error ? <div className={contentStyles.errorMessage}>{error}</div> : null}
        {loading ? <p>Lädt...</p> : null}
        {user ? (
          <div style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 8 }}>ID: {user.id}</div>
            <div style={{ marginBottom: 8 }}>Email: {user.email}</div>
            <div style={{ marginBottom: 12 }}>Name: {user.name || "-"}</div>
            {user.memberships?.length ? (
              <div style={{ marginBottom: 12 }}>
                <strong>Campaigns</strong>
                <ul>
                  {user.memberships.map((membership) => (
                    <li key={membership.id}>
                      <Link to={`/campaigns/${membership.campaign.slug}/overview`}>
                        {membership.campaign.name}
                      </Link>{" "}
                      — {membership.role}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <button
              className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
              onClick={handleDelete}
            >
              Account löschen
            </button>
            <button
              className={contentStyles.actionButton}
              onClick={handleLogout}
              style={{ marginLeft: 8 }}
            >
              Abmelden
            </button>
          </div>
        ) : null}
      </main>
    </Layout>
  );
}
