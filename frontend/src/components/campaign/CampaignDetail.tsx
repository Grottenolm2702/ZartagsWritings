import React from "react";
import ContentHeader from "./ContentHeader";
import ItemsGrid from "./ItemsGrid";
import { useAuthSafe } from "../../context/AuthContext";
import contentStyles from "../../styles/content.module.css";
import type { CardSpec, HeaderField } from "../../types/campaign";

interface CampaignDetailProps {
  title: string;
  headerFields?: HeaderField[];
  cards?: CardSpec[];
  type?: string;
}

export default function CampaignDetail({
  title,
  headerFields,
  cards,
  type,
}: CampaignDetailProps) {
  const auth = useAuthSafe();

  const [localHeader, setLocalHeader] = React.useState<
    HeaderField[] | undefined
  >(headerFields);
  const [localCards, setLocalCards] = React.useState<CardSpec[] | undefined>(
    cards,
  );
  const [showAddMenu, setShowAddMenu] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  function addField(typeName: string) {
    const newCard: CardSpec = { title: "New Field" };
    if (typeName === "paragraph") {
      newCard.content = { type: "paragraph", text: "" };
    } else if (typeName === "paragraphs") {
      newCard.content = { type: "paragraphs", paragraphs: [""] };
    } else if (typeName === "list") {
      newCard.content = { type: "list", items: [{ label: "" }] };
    } else if (typeName === "attributes") {
      newCard.content = {
        type: "attributes",
        items: [{ dt: "", dd: "" }],
      };
    } else if (typeName === "picture") {
      newCard.pictureSrc = "";
      newCard.pictureAlt = "";
    }
    setLocalCards((c) => (c ? [...c, newCard] : [newCard]));
    setShowAddMenu(false);
  }

  function removeCard(idx: number) {
    setLocalCards((prev) => {
      const copy = prev ? [...prev] : [];
      if (idx >= 0 && idx < copy.length) copy.splice(idx, 1);
      return copy;
    });
  }

  function confirmDeleteItem() {
    // destructive: just navigate back to manage and exit edit mode
    try {
      auth.setIsEditor(false);
    } catch {}
    window.location.href = "/capaign1/manage";
  }

  const displayTitle =
    localHeader && localHeader[0] && localHeader[0].value
      ? localHeader[0].value
      : title;

  return (
    <main className={contentStyles.campaignDetail}>
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
                className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
                onClick={() => setShowDeleteConfirm(true)}
                title="Delete this item"
              >
                Delete
              </button>

              <button
                className={contentStyles.actionButton}
                onClick={() => {
                  try {
                    auth.setIsEditor(false);
                  } catch {}
                }}
              >
                Save
              </button>
              <button
                className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
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
                  className={contentStyles.actionButton}
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
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <button
                      className={contentStyles.actionButton}
                      onClick={() => addField("paragraph")}
                    >
                      Paragraph
                    </button>
                    <button
                      className={contentStyles.actionButton}
                      onClick={() => addField("paragraphs")}
                    >
                      Paragraphs
                    </button>
                    <button
                      className={contentStyles.actionButton}
                      onClick={() => addField("list")}
                    >
                      List
                    </button>
                    <button
                      className={contentStyles.actionButton}
                      onClick={() => addField("attributes")}
                    >
                      Attributes
                    </button>
                    <button
                      className={contentStyles.actionButton}
                      onClick={() => addField("picture")}
                    >
                      Picture
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </div>

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
          onRemove={(idx) => removeCard(idx)}
        />
      )}

      {showDeleteConfirm ? (
        <div className={contentStyles.modalOverlay}>
          <div className={contentStyles.modal} role="dialog" aria-modal="true">
            <h3>Delete this item?</h3>
            <p>
              This will exit edit mode and navigate back to Manage. This action
              cannot be undone here.
            </p>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button
                className={`${contentStyles.actionButton} ${contentStyles.secondary}`}
                onClick={() => {
                  confirmDeleteItem();
                  setShowDeleteConfirm(false);
                }}
              >
                Confirm Delete
              </button>
              <button
                className={contentStyles.actionButton}
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
