import React from "react";
import Layout from "../components/Layout";
import contentStyles from "../styles/content.module.css";
import { useNavigate } from "react-router-dom";

type User = { id?: number; name?: string; email?: string };

function parseJwt(token: string | null): Record<string, unknown> | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function Users() {
  const navigate = useNavigate();
  const user = React.useMemo<User | null>(() => {
    const token = localStorage.getItem("token");
    const payload = parseJwt(token);
    return payload ? { id: payload.id as number, email: payload.email as string, name: payload.name as string } : null;
  }, []);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(() => {
    const token = localStorage.getItem("token");
    const payload = parseJwt(token);
    return payload ? null : "Nicht eingeloggt oder ungültiger Token";
  });

  async function handleDelete() {
    if (!confirm("Account wirklich löschen?")) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user", {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error(await res.text());
      try {
        localStorage.removeItem("token");
      } catch {
        // ignore
      }
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Löschen fehlgeschlagen";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <main>
        <h1>Userverwaltung</h1>
        {error ? <div style={{ color: "red" }}>{error}</div> : null}
        {user ? (
          <div style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 8 }}>ID: {user.id}</div>
            <div style={{ marginBottom: 8 }}>Email: {user.email}</div>
            <div style={{ marginBottom: 12 }}>Name: {user.name || "-"}</div>
            <button
              className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Lösche..." : "Account löschen"}
            </button>
          </div>
        ) : (
          <p>Keine Benutzerdaten vorhanden.</p>
        )}
      </main>
    </Layout>
  );
}