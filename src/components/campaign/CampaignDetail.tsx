import React from "react";
import ContentHeader, { HeaderField } from "./ContentHeader";
import ItemsGrid, { CardSpec } from "./ItemsGrid";
import { useAuth } from "../../context/AuthContext";

export default function CampaignDetail({
  title,
  headerFields,
  cards,
  type,
}: {
  title: string;
  headerFields?: HeaderField[];
  cards?: CardSpec[];
  type?: string;
}) {
  const auth = (() => {
    try {
      return useAuth();
    } catch {
      return {
        isEditor: false,
        toggleEditor: () => {},
        setIsEditor: (_: boolean) => {},
      } as any;
    }
  })();

  const [localHeader, setLocalHeader] = React.useState<
    HeaderField[] | undefined
  >(headerFields);
  const [localCards, setLocalCards] = React.useState<CardSpec[] | undefined>(
    cards,
  );
  const [showAddMenu, setShowAddMenu] = React.useState(false);

  const [players, setPlayers] = React.useState<{ id: string; name: string }[]>([]);
  const [newPlayer, setNewPlayer] = React.useState("");

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  React.useEffect(() => {
    setLocalHeader(headerFields);
  }, [headerFields]);
  React.useEffect(() => setLocalCards(cards), [cards]);

  React.useEffect(() => {
    if (!type) return;
    try {
      const stored = localStorage.getItem(`players:${type}`);
      if (stored) setPlayers(JSON.parse(stored));
    } catch {}
  }, [type]);

  function savePlayers(list: { id: string; name: string }[]) {
    if (!type) return;
    try {
      localStorage.setItem(`players:${type}`, JSON.stringify(list));
    } catch {}
  }

  function addField(typeName: string) {
    const newCard: CardSpec = { title: "New Field" } as CardSpec;
    if (typeName === "paragraph") {
      newCard.content = { type: "paragraph", text: "" } as any;
    } else if (typeName === "paragraphs") {
      newCard.content = { type: "paragraphs", paragraphs: [""] } as any;
    } else if (typeName === "list") {
      newCard.content = { type: "list", items: [{ label: "" }] } as any;
    } else if (typeName === "attributes") {
      newCard.content = {
        type: "attributes",
        items: [{ dt: "", dd: "" }],
      } as any;
    } else if (typeName === "picture") {
      newCard.pictureSrc = "";
      newCard.pictureAlt = "";
    }
    setLocalCards((c) => (c ? [...c, newCard] : [newCard]));
    setShowAddMenu(false);
  }

  const displayTitle =
    localHeader && localHeader[0] && localHeader[0].value
      ? localHeader[0].value
      : title;

  return (
    <main className="campaign-detail">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <h1 style={{ margin: 0 }}>{displayTitle}</h1>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          {auth.isEditor ? (
            <>
              <button
                className="action-button"
                onClick={() => {
                  try {
                    auth.setIsEditor(false);
                  } catch {}
                }}
              >
                Save
              </button>
              <button
                className="action-button secondary"
                onClick={() => {
                  // Cancel edits: revert by reloading page
                  try {
                    auth.setIsEditor(false);
                  } catch {}
                  window.location.reload();
                }}
              >
                Cancel
              </button>
              <div style={{ position: "relative" }}>
                <button
                  className="action-button"
                  onClick={() => setShowAddMenu((s) => !s)}
                >
                  Add Field
                </button>
                {showAddMenu ? (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      marginTop: "6px",
                      background: "var(--hover-color)",
                      padding: "8px",
                      borderRadius: "6px",
                    }}
                  >
                    <button
                      className="action-button"
                      onClick={() => addField("paragraph")}
                    >
                      Paragraph
                    </button>
                    <button
                      className="action-button"
                      onClick={() => addField("paragraphs")}
                    >
                      Paragraphs
                    </button>
                    <button
                      className="action-button"
                      onClick={() => addField("list")}
                    >
                      List
                    </button>
                    <button
                      className="action-button"
                      onClick={() => addField("attributes")}
                    >
                      Attributes
                    </button>
                    <button
                      className="action-button"
                      onClick={() => addField("picture")}
                    >
                      Picture
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <button
              className="action-button"
              onClick={() => {
                try {
                  auth.setIsEditor(true);
                } catch {}
              }}
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {auth.isDungeonMaster ? (
        <div style={{ marginTop: "12px", padding: "8px", border: "1px solid var(--hover-color)", borderRadius: "6px", background: "var(--primary-color)" }}>
          <h3 style={{ margin: "0 0 8px 0" }}>Players</h3>
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <input value={newPlayer} onChange={(e) => setNewPlayer(e.target.value)} placeholder="Player name" />
            <button
              className="action-button"
              onClick={() => {
                const name = newPlayer.trim();
                if (!name || !type) return;
                const id = slugify(name + "-" + Date.now());
                const p = { id, name };
                const next = [p, ...players];
                setPlayers(next);
                savePlayers(next);
                setNewPlayer("");
              }}
            >
              Add
            </button>
          </div>

          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {players.map((p) => (
              <li key={p.id} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ flex: 1 }}>{p.name}</span>
                <button
                  className="action-button secondary"
                  onClick={() => {
                    // kick
                    const next = players.filter((x) => x.id !== p.id);
                    setPlayers(next);
                    savePlayers(next);
                  }}
                >
                  Kick
                </button>
                <button
                  className="action-button"
                  onClick={() => {
                    const link = `${window.location.origin}/capaign1/${type}?join=${encodeURIComponent(p.id)}`;
                    try {
                      navigator.clipboard?.writeText(link);
                    } catch {}
                    // show prompt fallback
                    // eslint-disable-next-line no-alert
                    alert(`Invite link copied:\n${link}`);
                  }}
                >
                  Invite
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {localHeader && (
        <ContentHeader
          fields={localHeader}
          onChange={(idx, updated) =>
            setLocalHeader((prev) => {
              const copy = prev ? [...prev] : [];
              copy[idx] = updated;
              return copy;
            })
          }
        />
      )}
      {localCards && (
        <ItemsGrid
          cards={localCards}
          type={type}
          onUpdate={(idx, updated) => {
            setLocalCards((prev) => {
              const copy = prev ? [...prev] : [];
              copy[idx] = updated;
              return copy;
            });
          }}
        />
      )}
    </main>
  );
}
