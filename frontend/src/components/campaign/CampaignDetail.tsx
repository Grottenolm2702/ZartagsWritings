import React from "react";
import { useNavigate } from "react-router-dom";
import contentStyles from "../../styles/content.module.css";
import { apiFetch } from "../../lib/api";
import type {
  ApiCardContent,
  ApiCardSpec,
  ApiEntity,
  ApiEntityTemplate,
  ApiEntityType,
  ApiHeaderField,
} from "../../types/campaign-api";
import ContentHeader from "./ContentHeader";
import ItemsGrid from "./ItemsGrid";

type CampaignDetailProps = {
  campaignSlug: string;
  entityType: ApiEntityType;
  entity?: ApiEntity | null;
  template?: ApiEntityTemplate | null;
  editable?: boolean;
  isNew?: boolean;
};

type Draft = {
  name: string;
  summary: string;
  isVisible: boolean;
  sortOrder: number;
  headerFields: ApiHeaderField[];
  cards: ApiCardSpec[];
};

const ENTITY_TYPE_LABELS: Record<ApiEntityType, string> = {
  pc: "Player Character",
  npc: "NPC",
  magicitem: "Magic Item",
  location: "Location",
};

function createEmptyDraft(entityType: ApiEntityType, template?: ApiEntityTemplate | null): Draft {
  if (template) {
    return {
      name: template.name,
      summary: template.summary,
      isVisible: true,
      sortOrder: 0,
      headerFields: template.headerFields.map((field) => ({ ...field })),
      cards: template.cards.map((card) => ({
        ...card,
        content: cloneCardContent(card.content),
      })),
    };
  }

  return {
    name: "",
    summary: "",
    isVisible: true,
    sortOrder: 0,
    headerFields: [
      { label: "Name:", value: "" },
      { label: "Type:", value: ENTITY_TYPE_LABELS[entityType] },
    ],
    cards: [],
  };
}

function cloneCardContent(content?: ApiCardContent): ApiCardContent | undefined {
  return content ? JSON.parse(JSON.stringify(content)) : undefined;
}

function cloneDraft(entity: ApiEntity | null | undefined, entityType: ApiEntityType): Draft {
  if (!entity) return createEmptyDraft(entityType);
  return {
    name: entity.name,
    summary: entity.summary || "",
    isVisible: entity.isVisible,
    sortOrder: entity.sortOrder,
    headerFields: entity.headerFields.length
      ? entity.headerFields
      : [
          { label: "Name:", value: entity.name },
          { label: "Type:", value: ENTITY_TYPE_LABELS[entityType] },
        ],
    cards: entity.cards.map((card) => ({
      ...card,
      content: cloneCardContent(card.content),
    })),
  };
}

function createCard(kind: "paragraph" | "paragraphs" | "list" | "attributes" | "picture"): ApiCardSpec {
  if (kind === "picture") {
    return { title: "Neues Bild", pictureSrc: "", pictureAlt: "", wide: false };
  }

  if (kind === "paragraph") {
    return { title: "Neuer Text", content: { type: "paragraph", text: "" }, wide: false };
  }

  if (kind === "paragraphs") {
    return {
      title: "Mehrere Absätze",
      content: { type: "paragraphs", paragraphs: [""] },
      wide: false,
    };
  }

  if (kind === "list") {
    return {
      title: "Liste",
      content: { type: "list", items: [{ label: "", href: undefined }] },
      wide: false,
    };
  }

  return {
    title: "Attribute",
    content: { type: "attributes", items: [{ dt: "", dd: "" }] },
    wide: false,
  };
}

export default function CampaignDetail({
  campaignSlug,
  entityType,
  entity,
  template,
  editable = false,
  isNew = false,
}: CampaignDetailProps) {
  const navigate = useNavigate();
  const [draft, setDraft] = React.useState<Draft>(() =>
    entity ? cloneDraft(entity, entityType) : createEmptyDraft(entityType, template),
  );
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [previewMode, setPreviewMode] = React.useState(false);

  const title = draft.name || draft.headerFields[0]?.value || "Entity";
  const canEdit = editable && !previewMode;
  const editableHeaderFields = draft.headerFields
    .map((field, index) => ({ field, index }))
    .filter(({ field }) => {
      const label = field.label.trim().toLowerCase().replace(/:$/, "");
      return label !== "type";
    });

  function updateCard(index: number, updated: ApiCardSpec) {
    setDraft((current) => {
      const next = [...current.cards];
      next[index] = updated;
      return { ...current, cards: next };
    });
  }

  function removeCard(index: number) {
    setDraft((current) => ({
      ...current,
      cards: current.cards.filter((_, cardIndex) => cardIndex !== index),
    }));
  }

  function addHeaderField() {
    setDraft((current) => ({
      ...current,
      headerFields: [...current.headerFields, { label: "", value: "" }],
    }));
  }

  function removeHeaderField(index: number) {
    setDraft((current) => ({
      ...current,
      headerFields: current.headerFields.filter((_, fieldIndex) => fieldIndex !== index),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: draft.name,
        summary: draft.summary || null,
        isVisible: draft.isVisible,
        sortOrder: draft.sortOrder,
        headerFields: draft.headerFields,
        cards: draft.cards,
      };

      const path = isNew
        ? `/api/campaigns/${campaignSlug}/entities/${entityType}`
        : `/api/campaigns/${campaignSlug}/entities/${entityType}/${entity?.slug}`;
      const method = isNew ? "POST" : "PUT";
      const saved = await apiFetch<ApiEntity>(path, {
        method,
        body: JSON.stringify(payload),
      });
      navigate(`/campaigns/${campaignSlug}/${entityType}/${saved.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Entity konnte nicht gespeichert werden");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!entity) return;
    setSaving(true);
    setError(null);
    try {
      await apiFetch(`/api/campaigns/${campaignSlug}/entities/${entityType}/${entity.slug}`, {
        method: "DELETE",
      });
      navigate(`/campaigns/${campaignSlug}/${entityType}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Entity konnte nicht gelöscht werden");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className={contentStyles.campaignDetail}>
      <div className={contentStyles.campaignDetailHeader}>
        <h1 className={contentStyles.campaignDetailTitle}>{title}</h1>
        {editable ? (
          <div className={contentStyles.campaignDetailActions}>
            <button
              type="button"
              className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
              onClick={() => {
                setShowAddMenu(false);
                setDeleteOpen(false);
                setPreviewMode((current) => !current);
              }}
            >
              {previewMode ? "Bearbeiten" : "Vorschau"}
            </button>
            {!isNew && !previewMode ? (
              <button
                type="button"
                className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
                onClick={() => setDeleteOpen(true)}
              >
                Löschen
              </button>
            ) : null}
            {!previewMode ? (
              <>
                <button
                  type="button"
                  className={contentStyles.actionButton}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Speichern..." : "Speichern"}
                </button>
                <button
                  type="button"
                  className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
                  onClick={() => navigate(-1)}
                >
                  Abbrechen
                </button>
                <div className={contentStyles.campaignDetailAddMenu}>
                  <button
                    type="button"
                    className={contentStyles.actionButton}
                    onClick={() => setShowAddMenu((value) => !value)}
                  >
                    Feld hinzufügen
                  </button>
                  {showAddMenu ? (
                    <div className={`${contentStyles.modal} ${contentStyles.campaignDetailAddMenuPopover}`}>
                      <div className={contentStyles.campaignDetailAddMenuList}>
                        {[
                          ["paragraph", "Absatz"],
                          ["paragraphs", "Mehrere Absätze"],
                          ["list", "Liste"],
                          ["attributes", "Attribute"],
                          ["picture", "Bild"],
                        ].map(([kind, label]) => (
                          <button
                            key={kind}
                            type="button"
                            className={contentStyles.actionButton}
                            onClick={() => {
                              setDraft((current) => ({
                                ...current,
                                cards: [
                                  ...current.cards,
                                  createCard(
                                    kind as
                                      | "paragraph"
                                      | "paragraphs"
                                      | "list"
                                      | "attributes"
                                      | "picture",
                                  ),
                                ],
                              }));
                              setShowAddMenu(false);
                            }}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      {error ? <div className={contentStyles.errorMessage}>{error}</div> : null}

      {canEdit ? (
        <section className={contentStyles.cardSection}>
          <div className={contentStyles.cardSectionTitle}>Basisdaten</div>
          <div className={contentStyles.cardSectionContent}>
            <div className={contentStyles.campaignDetailBasisGrid}>
              <div>
                <strong>Type:</strong> {ENTITY_TYPE_LABELS[entityType]}
              </div>
              <label>
                Name
                <input
                  className={contentStyles.editInputTransparent}
                  value={draft.name}
                  onChange={(e) => setDraft((current) => ({ ...current, name: e.target.value }))}
                />
              </label>
              <label>
                Summary
                <textarea
                  className={contentStyles.editInputTransparent}
                  rows={4}
                  value={draft.summary}
                  onChange={(e) => setDraft((current) => ({ ...current, summary: e.target.value }))}
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={draft.isVisible}
                  onChange={(e) =>
                    setDraft((current) => ({ ...current, isVisible: e.target.checked }))
                  }
                />{" "}
                sichtbar
              </label>
            </div>
          </div>
        </section>
      ) : null}

      {editableHeaderFields.length > 0 ? (
        <ContentHeader
          fields={editableHeaderFields.map(({ field }) => field)}
          editable={canEdit}
          onChange={(index, updated) =>
            setDraft((current) => {
              const next = [...current.headerFields];
              next[editableHeaderFields[index].index] = updated;
              return { ...current, headerFields: next };
            })
          }
          onAdd={canEdit ? addHeaderField : undefined}
          onRemove={canEdit ? (index) => removeHeaderField(editableHeaderFields[index].index) : undefined}
        />
      ) : null}

      <ItemsGrid
        cards={draft.cards}
        editable={canEdit}
        onUpdate={updateCard}
        onRemove={removeCard}
      />

      {deleteOpen ? (
        <div className={contentStyles.modalOverlay}>
          <div className={contentStyles.modal} role="dialog" aria-modal="true">
            <h3>Entity löschen?</h3>
            <p>Diese Aktion kann nicht rückgängig gemacht werden.</p>
            <div className={contentStyles.campaignDetailDeleteActions}>
              <button
                type="button"
                className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
                onClick={() => setDeleteOpen(false)}
              >
                Abbrechen
              </button>
              <button type="button" className={contentStyles.actionButton} onClick={handleDelete}>
                Löschen
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
