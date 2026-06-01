import React from "react";
import ContentHeader, { HeaderField } from "./ContentHeader";
import ItemsGrid, { CardSpec } from "./ItemsGrid";
import { useAuthSafe } from "../../context/AuthContext";

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
  const auth = useAuthSafe();

  const [localHeader, setLocalHeader] = React.useState<
    HeaderField[] | undefined
  >(headerFields);
  const [localCards, setLocalCards] = React.useState<CardSpec[] | undefined>(
    cards,
  );
  const [showAddMenu, setShowAddMenu] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  React.useEffect(() => setLocalHeader(headerFields), [headerFields]);
  React.useEffect(() => setLocalCards(cards), [cards]);

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
                className="action-button secondary"
                onClick={() => setShowDeleteConfirm(true)}
                title="Delete this item"
              >
                Delete
              </button>

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
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
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
        <div className="modal-overlay">
          <div className="modal" role="dialog" aria-modal="true">
            <h3>Delete this item?</h3>
            <p>
              This will exit edit mode and navigate back to Manage. This action
              cannot be undone here.
            </p>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button
                className="action-button secondary"
                onClick={() => {
                  confirmDeleteItem();
                  setShowDeleteConfirm(false);
                }}
              >
                Confirm Delete
              </button>
              <button
                className="action-button"
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
