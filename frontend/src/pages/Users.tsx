import React from "react";
import Layout from "../components/Layout";
import contentStyles from "../styles/content.module.css";
import { useNavigate } from "react-router-dom";
import { useJWTAuth } from "../context/JWTAuthContext";

export default function Users() {
  const navigate = useNavigate();
  const { user, loading, error, loadUser, logout } = useJWTAuth();

  React.useEffect(() => {
    loadUser();
  }, [loadUser]);

  async function handleDelete() {
    if (!confirm("Account wirklich löschen?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user", {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error(await res.text());
      logout();
      navigate("/");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <Layout>
      <main>
        <h1>Userverwaltung</h1>
        {error ? <div style={{ color: "red" }}>{error}</div> : null}
        {loading ? <p>Lädt...</p> : null}
        {user ? (
          <div style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 8 }}>ID: {user.id}</div>
            <div style={{ marginBottom: 8 }}>Email: {user.email}</div>
            <div style={{ marginBottom: 12 }}>Name: {user.name || "-"}</div>
            <button
              className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
              onClick={handleDelete}
            >
              Account löschen
            </button>
          </div>
        ) : null}
      </main>
    </Layout>
  );
}
