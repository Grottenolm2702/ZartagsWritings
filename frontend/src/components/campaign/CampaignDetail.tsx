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

type AutoResizeTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const AutoResizeTextarea = React.forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>(
  function AutoResizeTextarea({ onChange, style, ...props }, forwardedRef) {
    const localRef = React.useRef<HTMLTextAreaElement | null>(null);

    const setRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        localRef.current = node;

        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    React.useLayoutEffect(() => {
      const element = localRef.current;
      if (!element) return;

      element.style.height = "auto";
      element.style.height = `${element.scrollHeight}px`;
    }, [props.value]);

    return (
      <textarea
        {...props}
        ref={setRef}
        onChange={onChange}
        style={{ ...style, overflow: "hidden", resize: "none" }}
      />
    );
  },
);

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

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= items.length) {
    return items;
  }

  const next = [...items];
  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return next;
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
    return { title: "New image", pictureSrc: "", pictureAlt: "", wide: false };
  }

  if (kind === "paragraph") {
    return { title: "New text", content: { type: "paragraph", text: "" }, wide: false };
  }

  if (kind === "paragraphs") {
    return {
      title: "Multiple paragraphs",
      content: { type: "paragraphs", paragraphs: [""] },
      wide: false,
    };
  }

  if (kind === "list") {
    return {
      title: "List",
      content: { type: "list", items: [{ label: "", href: undefined }] },
      wide: false,
    };
  }

  return {
    title: "Attributes",
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
  const initialDraft = React.useMemo(
    () => (entity ? cloneDraft(entity, entityType) : createEmptyDraft(entityType, template)),
    [entity, entityType, template],
  );
  const [draft, setDraft] = React.useState<Draft>(initialDraft);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [discardOpen, setDiscardOpen] = React.useState(false);
  const [previewMode, setPreviewMode] = React.useState(true);

  const title = draft.name || draft.headerFields[0]?.value || "Entity";
  const canEdit = editable && !previewMode;
  const defaultTypeValue = ENTITY_TYPE_LABELS[entityType].trim().toLowerCase();
  const editableHeaderFields = draft.headerFields
    .map((field, index) => ({ field, index }))
    .filter(({ field }) => {
      const label = field.label.trim().toLowerCase().replace(/:$/, "");
      if (label !== "type") return true;
      return field.value.trim().toLowerCase() !== defaultTypeValue;
    });

  function updateCard(index: number, updated: ApiCardSpec) {
    setDraft((current) => {
      const next = [...current.cards];
      next[index] = updated;
      return { ...current, cards: next };
    });
  }

  function moveCard(index: number, direction: -1 | 1) {
    setDraft((current) => ({ ...current, cards: moveItem(current.cards, index, direction) }));
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

  function moveHeaderField(index: number, direction: -1 | 1) {
    setDraft((current) => ({
      ...current,
      headerFields: moveItem(current.headerFields, index, direction),
    }));
  }

  function discardChanges() {
    setDraft(initialDraft);
    setShowAddMenu(false);
    setDeleteOpen(false);
    setDiscardOpen(false);
    setPreviewMode(true);
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
      setError(err instanceof Error ? err.message : "Failed to save entity");
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
      navigate(`/campaigns/${campaignSlug}/overview`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete entity");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className={contentStyles.campaignDetail}>
      <div className={contentStyles.campaignDetailTopActions} role="navigation" aria-label="Back navigation">
        <button
          type="button"
          className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
          onClick={() => navigate(`/campaigns/${campaignSlug}/overview`)}
        >
          ← Back to overview
        </button>
      </div>
      <header className={contentStyles.campaignDetailHeader}>
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
              {previewMode ? "Edit" : "Preview"}
            </button>
            {!isNew && !previewMode ? (
              <button
                type="button"
                className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
                onClick={() => setDeleteOpen(true)}
              >
                Delete
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
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
                  onClick={() => setDiscardOpen(true)}
                >
                  Cancel
                </button>
                <div className={contentStyles.campaignDetailAddMenu}>
                  <button
                    type="button"
                    className={contentStyles.actionButton}
                    onClick={() => setShowAddMenu((value) => !value)}
                    aria-expanded={showAddMenu}
                    aria-controls="card-add-menu"
                  >
                    Add field
                  </button>
                  {showAddMenu ? (
                    <div
                      id="card-add-menu"
                      className={`${contentStyles.modal} ${contentStyles.campaignDetailAddMenuPopover}`}
                    >
                      <div className={contentStyles.campaignDetailAddMenuList}>
                        {[
                          ["paragraph", "Paragraph"],
                          ["paragraphs", "Multiple paragraphs"],
                          ["list", "List"],
                          ["attributes", "Attributes"],
                          ["picture", "Image"],
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
      </header>

      {error ? <div className={contentStyles.errorMessage} role="alert">{error}</div> : null}

      {canEdit ? (
        <section className={contentStyles.cardSection}>
          <div className={contentStyles.cardSectionTitle}>Basic data</div>
          <div className={contentStyles.cardSectionContent}>
            <div className={contentStyles.campaignDetailBasisGrid}>
              <div>
                <strong>Type:</strong> {ENTITY_TYPE_LABELS[entityType]}
              </div>
              <label htmlFor="entity-name">
                Name
                <input
                  id="entity-name"
                  className={contentStyles.editInputTransparent}
                  value={draft.name}
                  onChange={(e) => setDraft((current) => ({ ...current, name: e.target.value }))}
                />
              </label>
              <label htmlFor="entity-summary">
                Summary
                <AutoResizeTextarea
                  id="entity-summary"
                  className={contentStyles.editInputTransparent}
                  rows={4}
                  value={draft.summary}
                  onChange={(e) => setDraft((current) => ({ ...current, summary: e.target.value }))}
                />
              </label>
              <label htmlFor="entity-visible">
                <input
                  id="entity-visible"
                  type="checkbox"
                  checked={draft.isVisible}
                  onChange={(e) =>
                    setDraft((current) => ({ ...current, isVisible: e.target.checked }))
                  }
                />{" "}
                visible
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
          onMove={
            canEdit
              ? (index, direction) =>
                  moveHeaderField(editableHeaderFields[index].index, direction)
              : undefined
          }
        />
      ) : null}

      <ItemsGrid
        cards={draft.cards}
        editable={canEdit}
        onUpdate={updateCard}
        onRemove={removeCard}
        onMove={moveCard}
      />

      {deleteOpen ? (
        <div className={contentStyles.modalOverlay}>
          <div
            className={contentStyles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-entity-title"
            aria-describedby="delete-entity-description"
          >
            <h3 id="delete-entity-title">Delete entity?</h3>
            <p id="delete-entity-description">This action cannot be undone.</p>
            <div className={contentStyles.campaignDetailDeleteActions}>
              <button
                type="button"
                className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
                onClick={() => setDeleteOpen(false)}
              >
                Cancel
              </button>
              <button type="button" className={contentStyles.actionButton} onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {discardOpen ? (
        <div className={contentStyles.modalOverlay}>
          <div
            className={contentStyles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="discard-changes-title"
            aria-describedby="discard-changes-description"
          >
            <h3 id="discard-changes-title">Änderungen wirklich verwerfen?</h3>
            <p id="discard-changes-description">Alle ungespeicherten Änderungen gehen verloren.</p>
            <div className={contentStyles.campaignDetailDeleteActions}>
              <button
                type="button"
                className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
                onClick={() => setDiscardOpen(false)}
              >
                Abbrechen
              </button>
              <button type="button" className={contentStyles.actionButton} onClick={discardChanges}>
                Verwerfen
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
