import React from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useJWTAuth } from "../context/JWTAuthContext";
import { apiFetch } from "../lib/api";
import type {
  ApiCampaign,
  ApiEntity,
  ApiEntityType,
} from "../types/campaign-api";
import contentStyles from "../styles/content.module.css";
import overviewStyles from "../styles/overview.module.css";

const TYPE_LABELS: Record<ApiEntityType, string> = {
  pc: "Player Characters",
  npc: "NPCs",
  magicitem: "Magic Items",
  location: "Locations",
};

const TYPE_ORDER: ApiEntityType[] = ["pc", "npc", "magicitem", "location"];

function getEntityPath(campaignSlug: string, entity: ApiEntity) {
  return `/campaigns/${campaignSlug}/${entity.type}/${entity.slug}`;
}

function createEntityPayload(entity: ApiEntity) {
  return {
    slug: entity.slug,
    name: entity.name,
    summary: entity.summary ?? null,
    isVisible: entity.isVisible,
    sortOrder: entity.sortOrder,
    headerFields: entity.headerFields,
    cards: entity.cards,
  };
}

export default function CampaignOverview() {
  const { slug } = useParams();
  const { user } = useJWTAuth();
  const campaignSlug = slug;
  const [campaign, setCampaign] = React.useState<ApiCampaign | null>(null);
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (!campaignSlug) {
          throw new Error("Campaign slug is missing");
        }
        const data = await apiFetch<ApiCampaign>(
          `/api/campaigns/${campaignSlug}`,
        );
        if (mounted) setCampaign(data);
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load overview",
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [campaignSlug]);

  const currentMembership = campaign?.members.find(
    (member) => member.userId === user?.id,
  );
  const editable =
    campaign?.owner?.id === user?.id ||
    currentMembership?.role === "DM" ||
    currentMembership?.role === "EDITOR";

  const filteredEntities = React.useMemo(() => {
    const base = campaign?.entities ?? [];
    const term = query.trim().toLowerCase();
    const matches = term
      ? base.filter(
          (entity) =>
            entity.name.toLowerCase().includes(term) ||
            entity.summary?.toLowerCase().includes(term) ||
            entity.slug.toLowerCase().includes(term),
        )
      : base;
    if (editable) return matches;
    return matches.filter((entity) => entity.isVisible);
  }, [campaign?.entities, editable, query]);

  const accessibleEntities = React.useMemo(() => {
    const base = campaign?.entities ?? [];
    if (editable) return base;
    return base.filter((entity) => entity.isVisible);
  }, [campaign?.entities, editable]);

  const groupedEntities = React.useMemo(() => {
    const groups: Record<ApiEntityType, ApiEntity[]> = {
      pc: [],
      npc: [],
      magicitem: [],
      location: [],
    };

    for (const entity of filteredEntities) {
      groups[entity.type].push(entity);
    }

    return groups;
  }, [filteredEntities]);

  async function updateVisibility(entity: ApiEntity, isVisible: boolean) {
    if (!campaignSlug) return;
    const saved = await apiFetch<ApiEntity>(
      `/api/campaigns/${campaignSlug}/entities/${entity.type}/${entity.slug}`,
      {
        method: "PUT",
        body: JSON.stringify({
          ...createEntityPayload(entity),
          isVisible,
        }),
      },
    );

    setCampaign((current) =>
      current
        ? {
            ...current,
            entities: current.entities.map((entry) =>
              entry.id === saved.id ? saved : entry,
            ),
          }
        : current,
    );
  }

  return (
    <Layout>
      <main>
        <header className={contentStyles.campaignOverviewHeader}>
          <h1 className={contentStyles.campaignOverviewTitle}>
            Overview{campaign?.name ? `: ${campaign.name}` : ""}
          </h1>
          <div className={contentStyles.campaignOverviewHeaderActions}>
            <Link
              className={contentStyles.actionButton}
              to={`/campaigns/${campaignSlug}/manage`}
            >
              Manage campaign
            </Link>
          </div>
        </header>

        <section className={overviewStyles.filterContainer} aria-label="Suche">
          <input
            type="text"
            className={overviewStyles.searchbar}
            placeholder="search entries"
            aria-label="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </section>

        {loading ? <p>Loading...</p> : null}
        {error ? (
          <div className={contentStyles.errorMessage} role="alert">
            {error}
          </div>
        ) : null}

        {campaign && accessibleEntities.length === 0 ? (
          <section
            className={contentStyles.emptyStateCard}
            aria-label="No entries found"
          >
            <h2 className={contentStyles.emptyStateTitle}>No entries yet</h2>
            <p className={contentStyles.emptyStateText}>
              There are no entries in this campaign yet.
            </p>
          </section>
        ) : null}
        {campaign &&
        accessibleEntities.length > 0 &&
        filteredEntities.length === 0 ? (
          <section
            className={contentStyles.emptyStateCard}
            aria-label="No search results"
          >
            <h2 className={contentStyles.emptyStateTitle}>
              No matching entries
            </h2>
            <p className={contentStyles.emptyStateText}>
              Try a different search term.
            </p>
          </section>
        ) : null}

        {campaign
          ? TYPE_ORDER.map((type) => {
              const entries = groupedEntities[type];
              if (entries.length === 0 && !editable) return null;

              return (
                <section
                  key={type}
                  className={overviewStyles.elementSection}
                  data-category={type}
                >
                  <h2 className={overviewStyles.sectionHeader}>
                    <span>{TYPE_LABELS[type]}</span>
                    {editable ? (
                      <Link
                        className={overviewStyles.smallNewButton}
                        to={`/campaigns/${campaignSlug}/${type}/new`}
                      >
                        New
                      </Link>
                    ) : null}
                  </h2>
                  {entries.length > 0 ? (
                    <ul className={overviewStyles.elementList}>
                      {entries.map((entity) => (
                        <li
                          key={entity.id}
                          className={overviewStyles.elementListItem}
                        >
                          <div className={overviewStyles.elementRow}>
                            <Link
                              to={getEntityPath(campaignSlug || "", entity)}
                              className={`${overviewStyles.elementLink}${entity.isVisible ? "" : ` ${contentStyles.campaignOverviewEntityLinkHidden}`}`}
                            >
                              <strong>{entity.name}</strong>
                              {entity.summary ? (
                                <span>{entity.summary}</span>
                              ) : null}
                            </Link>

                            {editable ? (
                              <label
                                className={overviewStyles.visibilityToggle}
                              >
                                <input
                                  type="checkbox"
                                  checked={entity.isVisible}
                                  aria-label={`${entity.name} visible`}
                                  onChange={() =>
                                    updateVisibility(entity, !entity.isVisible)
                                  }
                                />
                                Visible
                              </label>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No entries yet.</p>
                  )}
                </section>
              );
            })
          : null}
      </main>
    </Layout>
  );
}
