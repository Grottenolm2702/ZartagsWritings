import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuthSafe } from "../context/AuthContext";
import raw from "../data/exampleData.json";
import type {
  RawData,
  CampaignData,
  HeaderField,
  CardSpec,
  NavigationState,
} from "../types/campaign";

type Item = {
  id: string;
  category: string;
  title: string;
  to: string;
  visible?: boolean;
};

const CATEGORIES = ["Pcs", "Npcs", "Mi", "Loc"] as const;
const LABEL_MAP: Record<string, string> = {
  Pcs: "Player Caracters",
  Npcs: "Npcs",
  Mi: "Magic Items",
  Loc: "Locations",
};
const TYPE_MAP: Record<string, string> = {
  Pcs: "pc",
  Npcs: "npc",
  Mi: "magicitem",
  Loc: "location",
};

export default function CampaignOverview() {
  const [query, setQuery] = React.useState<string>("");

  // helper: slugify used for ids and urls
  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const rawInitial: Omit<Item, "id">[] = [
    {
      category: "Pcs",
      title: "Melissa - Fighter - Tiefling",
      to: "/capaign1/pc",
      visible: true,
    },
    {
      category: "Pcs",
      title: "Ronny - Garten - Zwerg",
      to: "#",
      visible: true,
    },
    {
      category: "Pcs",
      title: "Human - Male - Fighter",
      to: "#",
      visible: true,
    },

    { category: "Npcs", title: "Zartag", to: "/capaign1/npc", visible: true },
    { category: "Npcs", title: "Irenäus", to: "#", visible: true },
    { category: "Npcs", title: "Manuel", to: "#", visible: true },

    {
      category: "Mi",
      title: "Das Buch",
      to: "/capaign1/magicitem",
      visible: true,
    },
    { category: "Mi", title: "Warschip", to: "#", visible: true },
    { category: "Mi", title: "haus", to: "#", visible: true },

    { category: "Loc", title: "Elarint", to: "#", visible: true },
    {
      category: "Loc",
      title: "Das Herrenhaus",
      to: "/capaign1/location",
      visible: true,
    },
    { category: "Loc", title: "Der Brunnen", to: "#", visible: true },
  ];

  const initialItems: Item[] = rawInitial.map((r) => ({
    ...r,
    id: slugify(r.title),
  }));

  const [items, setItems] = React.useState<Item[]>(initialItems);

  const auth = useAuthSafe();

  const q = query.trim().toLowerCase();
  const filtered = React.useMemo(() => {
    const base =
      q === "" ? items : items.filter((i) => i.title.toLowerCase().includes(q));
    // if not editor or dm, hide invisible entries
    if (!auth.isEditor && !auth.isDungeonMaster) {
      return base.filter((i) => i.visible !== false);
    }
    return base;
  }, [items, q, auth.isEditor, auth.isDungeonMaster]);

  React.useEffect(() => {
    // keep effect for future analytics
  }, [query, filtered.length]);

  const grouped = React.useMemo(() => {
    const g: Record<string, Item[]> = {} as Record<string, Item[]>;
    for (const c of CATEGORIES) g[c] = [];
    for (const it of filtered) {
      if (!g[it.category]) g[it.category] = [];
      g[it.category].push(it);
    }
    return g;
  }, [filtered]);

  // modal state for new item
  const [showNewFor, setShowNewFor] = React.useState<string | null>(null);
  const [newTitle, setNewTitle] = React.useState("");
  const navigate = useNavigate();

  return (
    <Layout>
      <main>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h1 style={{ margin: 0 }}>Overview</h1>
          <div style={{ marginLeft: "auto" }}>
            <button
              className="action-button"
              onClick={() => navigate("/capaign1/manage")}
            >
              Campaign verwalten
            </button>
          </div>
        </div>

        <div className="filter-container">
          <input
            type="text"
            className="searchbar"
            placeholder="search entries"
            aria-label="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <p>No entries found.</p>
        ) : (
          CATEGORIES.map((cat) =>
            grouped[cat] && grouped[cat].length > 0 ? (
              <section
                key={cat}
                className="element-section"
                data-category={cat}
              >
                <h2
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{LABEL_MAP[cat]}</span>
                  {auth.isEditor ? (
                    <button
                      className="new-button"
                      onClick={() => {
                        setShowNewFor(cat);
                        setNewTitle("");
                      }}
                    >
                      New
                    </button>
                  ) : null}
                </h2>
                <ul className="element-list">
                  {grouped[cat].map((it) => (
                    <li
                      key={it.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Link
                        to={it.to}
                        style={{
                          opacity: it.visible === false ? 0.4 : 1,
                          flex: 1,
                        }}
                      >
                        {it.title}
                      </Link>

                      {auth.isDungeonMaster ? (
                        <label
                          style={{
                            marginLeft: "auto",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            paddingRight: "8px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={it.visible !== false}
                            onChange={() => {
                              setItems((s) =>
                                s.map((x) =>
                                  x.id === it.id
                                    ? {
                                        ...x,
                                        visible:
                                          x.visible === false ? true : false,
                                      }
                                    : x,
                                ),
                              );
                            }}
                          />
                          visible
                        </label>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null,
          )
        )}

        {showNewFor ? (
          <div className="modal-overlay">
            <div className="modal" role="dialog" aria-modal="true">
              <h3>Create new entry in {LABEL_MAP[showNewFor]}</h3>
              <label>Title</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                <button
                  className="action-button"
                  onClick={() => {
                    const type = TYPE_MAP[showNewFor as string];
                    const slug = slugify(newTitle || "new");
                    const to = `/capaign1/${type}/${slug}`;
                    const ni: Item = {
                      id: slug,
                      category: showNewFor as string,
                      title: newTitle || "New Entry",
                      to,
                      visible: true,
                    };
                    setItems((s) => [ni, ...s]);

                    // build empty draft from example data for selected category
                    const titleFallback = newTitle || "New Entry";
                    const exampleMap: Record<string, CampaignData | undefined> =
                      {
                        Pcs: (raw as RawData).pc,
                        Npcs: (raw as RawData).npc,
                        Mi: (raw as RawData).magicItem,
                        Loc: (raw as RawData).location,
                      };
                    const example = exampleMap[showNewFor as string];

                    if (example) {
                      const emptyHeader: HeaderField[] = (
                        example.header || []
                      ).map((h) => ({ ...h, value: titleFallback }));
                      const emptyCards: CardSpec[] = (example.cards || []).map(
                        (c) => {
                          const base: Partial<CardSpec> = {
                            title: c.title,
                            wide: c.wide,
                          };
                          const cardTitle =
                            c && c.title ? c.title : titleFallback;
                          if (c.pictureSrc !== undefined) {
                            base.pictureSrc = "";
                            base.pictureAlt = cardTitle;
                          }

                          // handle CardSpec where content might be React element or raw object
                          const rawContent =
                            c &&
                            c.content &&
                            (c.content as unknown as Record<string, unknown>)
                              .props &&
                            (
                              (c.content as unknown as Record<string, unknown>)
                                .props as Record<string, unknown>
                            ).content
                              ? (
                                  (
                                    c.content as unknown as Record<
                                      string,
                                      unknown
                                    >
                                  ).props as Record<string, unknown>
                                ).content
                              : c.content;
                          if (rawContent) {
                            const ct = (rawContent as Record<string, unknown>)
                              .type;
                            if (ct === "paragraph")
                              base.content = {
                                type: "paragraph",
                                text: cardTitle,
                              };
                            else if (ct === "paragraphs")
                              base.content = {
                                type: "paragraphs",
                                paragraphs: [cardTitle],
                              };
                            else if (ct === "list")
                              base.content = {
                                type: "list",
                                items: [{ label: cardTitle }],
                              };
                            else if (ct === "attributes") {
                              const dt =
                                (rawContent as Record<string, unknown>).items &&
                                Array.isArray(
                                  (rawContent as Record<string, unknown>).items,
                                ) &&
                                (
                                  (rawContent as Record<string, unknown>)
                                    .items as unknown[]
                                )[0]
                                  ? (
                                      (
                                        (rawContent as Record<string, unknown>)
                                          .items as unknown[]
                                      )[0] as Record<string, unknown>
                                    ).dt || ""
                                  : "";
                              base.content = {
                                type: "attributes",
                                items: [{ dt, dd: cardTitle }],
                              };
                            }
                          }
                          return base as CardSpec;
                        },
                      );
                      navigate(to, {
                        state: {
                          newDraft: true,
                          header: emptyHeader,
                          cards: emptyCards,
                        } as NavigationState,
                      });
                    } else {
                      navigate(to);
                    }

                    setShowNewFor(null);
                  }}
                >
                  Save
                </button>
                <button
                  className="action-button secondary"
                  onClick={() => setShowNewFor(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </Layout>
  );
}
