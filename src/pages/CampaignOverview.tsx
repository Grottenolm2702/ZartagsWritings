import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

type Item = { category: string; title: string; to: string };

export default function CampaignOverview() {
  const [query, setQuery] = React.useState<string>("");

  const items: Item[] = React.useMemo(
    () => [
      { category: "Pcs", title: "Melissa - Fighter - Tiefling", to: "/capaign1/pc" },
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
    ],
    []
  );

  const q = query.trim().toLowerCase();
  const filtered = React.useMemo(
    () => (q === "" ? items : items.filter((i) => i.title.toLowerCase().includes(q))),
    [items, q]
  );

  React.useEffect(() => {
    // debug: ensure query and filtered update
    // eslint-disable-next-line no-console
    console.debug("Overview search", { query, filteredCount: filtered.length });
  }, [query, filtered.length]);

  const categories = ["Pcs", "Npcs", "Mi", "Loc"];
  const labelMap: Record<string, string> = {
    Pcs: "Player Caracters",
    Npcs: "Npcs",
    Mi: "Magic Items",
    Loc: "Locations",
  };

  const grouped = React.useMemo(() => {
    const g: Record<string, Item[]> = {} as Record<string, Item[]>;
    for (const c of categories) g[c] = [];
    for (const it of filtered) {
      if (!g[it.category]) g[it.category] = [];
      g[it.category].push(it);
    }
    return g;
  }, [filtered]);

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
              <section key={cat} className="element-section" data-category={cat}>
                <h2>{labelMap[cat]}</h2>
                <ul className="element-list">
                  {grouped[cat].map((it, idx) => (
                    <li key={idx}>
                      <Link to={it.to}>{it.title}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null
          )
        )}
      </main>
    </Layout>
  );
}
