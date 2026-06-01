import React from "react";
import Layout from "../../components/Layout";
import raw from "../../data/exampleData.json";
import { useAuth } from "../../context/AuthContext";

export default function ManageCampaign() {
  const auth = (() => {
    try {
      return useAuth();
    } catch {
      return { isDungeonMaster: false } as any;
    }
  })();

  const examplePlayers: any[] = (raw as any).overview?.campaignPlayers || [];
  const [players, setPlayers] = React.useState<
    { id: string; name: string; isEditor?: boolean }[]
  >([]);

  const [currentId, setCurrentId] = React.useState<string | null>(() => {
    try {
      return localStorage.getItem("currentPlayerId");
    } catch {
      return null;
    }
  });

  const [dmId, setDmId] = React.useState<string | null>(() => {
    try {
      return localStorage.getItem("campaign:dm");
    } catch {
      return null;
    }
  });

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("campaign:players");
      if (stored) setPlayers(JSON.parse(stored));
      else setPlayers(examplePlayers);
    } catch {
      setPlayers(examplePlayers);
    }
  }, []);

  // ensure there is a dmId (default to first player) and enforce dm is editor
  React.useEffect(() => {
    if (players && players.length > 0) {
      if (!dmId) {
        const first = players[0].id;
        try {
          localStorage.setItem("campaign:dm", first);
        } catch {}
        setDmId(first);
      } else {
        // ensure dm is editor
        const updated = players.map((p) =>
          p.id === dmId ? { ...p, isEditor: true } : p,
        );
        const changed = JSON.stringify(updated) !== JSON.stringify(players);
        if (changed) {
          try {
            localStorage.setItem("campaign:players", JSON.stringify(updated));
          } catch {}
          setPlayers(updated);
        }
      }
    }
  }, [players, dmId]);

  React.useEffect(() => {
    // if no currentId set, default to first player
    if (!currentId && players && players.length > 0) {
      setCurrentId((prev) => prev || players[0].id);
    }
  }, [players, currentId]);

  function save(list: typeof players) {
    try {
      // enforce dm always editor
      const enforced = dmId
        ? list.map((p) => (p.id === dmId ? { ...p, isEditor: true } : p))
        : list;
      localStorage.setItem("campaign:players", JSON.stringify(enforced));
      setPlayers(enforced);
    } catch {}
  }

  return (
    <Layout>
      <main>
        <h1>Campaign verwalten</h1>
        <p>Invite link (example):</p>
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <input
            readOnly
            value={`${window.location.origin}/capaign1/join?campaign=capaign1`}
            style={{ width: "100%" }}
          />
          <button
            className="action-button"
            onClick={() => {
              try {
                navigator.clipboard?.writeText(
                  `${window.location.origin}/capaign1/join?campaign=capaign1`,
                );
              } catch {}
              alert("Invite link copied");
            }}
          >
            Copy
          </button>
        </div>

        <h2>Players</h2>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {players.map((p) => (
            <li
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "6px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>{p.name}</span>
                {p.isEditor ? (
                  <span style={{ color: "#666" }}>(Editor)</span>
                ) : null}
                {dmId && p.id === dmId ? (
                  <span
                    style={{
                      background: "#333",
                      color: "#fff",
                      padding: "2px 6px",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  >
                    DM
                  </span>
                ) : null}
              </div>

              {auth.isDungeonMaster ? (
                <>
                  {dmId && p.id === dmId ? null : (
                    <button
                      className="action-button"
                      onClick={() => {
                        const next = players.map((x) =>
                          x.id === p.id ? { ...x, isEditor: !x.isEditor } : x,
                        );
                        save(next);
                      }}
                    >
                      {p.isEditor ? "Revoke Editor" : "Make Editor"}
                    </button>
                  )}

                  <button
                    className="action-button secondary"
                    onClick={() => {
                      const next = players.filter((x) => x.id !== p.id);
                      // if kicked player was dm, clear dm and pick new later
                      const nextDm = dmId === p.id ? null : dmId;
                      try {
                        if (nextDm) localStorage.setItem("campaign:dm", nextDm);
                        else localStorage.removeItem("campaign:dm");
                      } catch {}
                      setDmId(nextDm);
                      save(next);
                    }}
                  >
                    Kick
                  </button>
                </>
              ) : null}

              {currentId && p.id === currentId ? (
                <button
                  className="action-button"
                  onClick={() => {
                    const next = players.filter((x) => x.id !== p.id);
                    save(next);
                    // if left, clear current user
                    try {
                      localStorage.removeItem("currentPlayerId");
                      setCurrentId(null);
                    } catch {}
                    // if left player was dm, clear dm
                    if (dmId === p.id) {
                      try {
                        localStorage.removeItem("campaign:dm");
                      } catch {}
                      setDmId(null);
                    }
                  }}
                >
                  Leave
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </main>
    </Layout>
  );
}
