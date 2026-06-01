import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { MAGICITEM_EXAMPLE, PC_EXAMPLE, NPC_EXAMPLE, LOCATION_EXAMPLE } from "../data/exampleData";

type Item = { category: string; title: string; to: string };

export default function CampaignOverview() {
  const [query, setQuery] = React.useState<string>("");

  const initialItems: Item[] = [
    {
      category: "Pcs",
      title: "Melissa - Fighter - Tiefling",
      to: "/capaign1/pc",
    },
    { category: "Pcs", title: "Ronny - Garten - Zwerg", to: "#" },
    { category: "Pcs", title: "Human - Male - Fighter", to: "#" },

    { category: "Npcs", title: "Zartag", to: "/capaign1/npc" },
    { category: "Npcs", title: "Irenäus", to: "#" },
    { category: "Npcs", title: "Manuel", to: "#" },

    { category: "Mi", title: "Das Buch", to: "/capaign1/magicitem" },
    { category: "Mi", title: "Warschip", to: "#" },
    { category: "Mi", title: "haus", to: "#" },

    { category: "Loc", title: "Elarint", to: "#" },
    { category: "Loc", title: "Das Herrenhaus", to: "/capaign1/location" },
    { category: "Loc", title: "Der Brunnen", to: "#" },
  ];
  const [items, setItems] = React.useState<Item[]>(initialItems);

  const q = query.trim().toLowerCase();
  const filtered = React.useMemo(
    () =>
      q === "" ? items : items.filter((i) => i.title.toLowerCase().includes(q)),
    [items, q],
  );

  React.useEffect(() => {
    // keep effect for future analytics
  }, [query, filtered.length]);

  const categories = ["Pcs", "Npcs", "Mi", "Loc"];
  const labelMap: Record<string, string> = {
    Pcs: "Player Caracters",
    Npcs: "Npcs",
    Mi: "Magic Items",
    Loc: "Locations",
  };

  const typeMap: Record<string, string> = {
    Pcs: "pc",
    Npcs: "npc",
    Mi: "magicitem",
    Loc: "location",
  };

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const grouped = React.useMemo(() => {
    const g: Record<string, Item[]> = {} as Record<string, Item[]>;
    for (const c of categories) g[c] = [];
    for (const it of filtered) {
      if (!g[it.category]) g[it.category] = [];
      g[it.category].push(it);
    }
    return g;
  }, [filtered, items]);

  // modal state for new item
  const [showNewFor, setShowNewFor] = React.useState<string | null>(null);
  const [newTitle, setNewTitle] = React.useState("");
  const navigate = useNavigate();

  return (
    <Layout>
      <main>
        <h1>Overview</h1>

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
          categories.map((cat) =>
            grouped[cat] && grouped[cat].length > 0 ? (
              <section
                key={cat}
                className="element-section"
                data-category={cat}
              >
                <h2 style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{labelMap[cat]}</span>
                  <button
                    className="new-button"
                    onClick={() => {
                      setShowNewFor(cat);
                      setNewTitle("");
                    }}
                  >
                    New
                  </button>
                </h2>
                <ul className="element-list">
                  {grouped[cat].map((it, idx) => (
                    <li key={idx}>
                      <Link to={it.to}>{it.title}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null,
          )
        )}

      {/* New item modal */}
      {showNewFor ? (
        <div className="modal-overlay">
          <div className="modal" role="dialog" aria-modal="true">
            <h3>Create new entry in {labelMap[showNewFor]}</h3>
            <label>Title</label>
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
              <button
                className="action-button"
                onClick={() => {
                  const type = typeMap[showNewFor as string];
                  const slug = slugify(newTitle || "new");
                  const to = `/capaign1/${type}/${slug}`;
                  const ni: Item = { category: showNewFor as string, title: newTitle || "New Entry", to };
                  setItems((s) => [ni, ...s]);

                  // build empty draft from example data for selected category
                  const titleFallback = newTitle || "New Entry";
                  const exampleMap: Record<string, any> = {
                    Pcs: PC_EXAMPLE,
                    Npcs: NPC_EXAMPLE,
                    Mi: MAGICITEM_EXAMPLE,
                    Loc: LOCATION_EXAMPLE,
                  };
                  const example = exampleMap[showNewFor as string];

                  if (example) {
                    const emptyHeader = (example.header || []).map((h: any) => ({ ...h, value: titleFallback }));
                    const emptyCards = (example.cards || []).map((c: any) => {
                      const base: any = { title: c.title, wide: c.wide };
                      const cardTitle = c && c.title ? c.title : titleFallback;
                      if (c.pictureSrc !== undefined) {
                        base.pictureSrc = "";
                        base.pictureAlt = cardTitle;
                      }

                      // handle CardSpec where content might be React element or raw object
                      const rawContent = c && c.content && c.content.props && c.content.props.content ? c.content.props.content : c.content;
                      if (rawContent) {
                        const ct = rawContent.type;
                        if (ct === "paragraph") base.content = { type: "paragraph", text: cardTitle };
                        else if (ct === "paragraphs") base.content = { type: "paragraphs", paragraphs: [cardTitle] };
                        else if (ct === "list") base.content = { type: "list", items: [{ label: cardTitle }] };
                        else if (ct === "attributes") {
                          const dt = rawContent.items && rawContent.items[0] ? rawContent.items[0].dt || "" : "";
                          base.content = { type: "attributes", items: [{ dt, dd: cardTitle }] };
                        }
                      }
                      return base;
                    });
                    navigate(to, { state: { newDraft: true, header: emptyHeader, cards: emptyCards } });
                  } else {
                    navigate(to);
                  }

                  setShowNewFor(null);
                }}
              >
                Save
              </button>
              <button className="action-button secondary" onClick={() => setShowNewFor(null)}>
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

