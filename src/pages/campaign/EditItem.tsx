import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import raw from "../../data/exampleData.json";
import Layout from "../../components/Layout";
import EditableCardContent from "../../components/campaign/EditableCardContent";
import { useAuth } from "../../context/AuthContext";
import contentStyles from "../../styles/content.module.css";
import layoutStyles from "../../styles/layout.module.css";
import type {
  RawData,
  CampaignData,
  CardSpec,
  HeaderField,
} from "../../types/campaign";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function EditItemPage() {
  const { type, slug } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const key = (type || "").toLowerCase();

  const dataset: CampaignData | undefined = (raw as RawData)[
    key as keyof RawData
  ] as CampaignData | undefined;
  if (!dataset) {
    return (
      <Layout>
        <main>
          <h1>Edit - Unknown type</h1>
          <p>Unknown campaign type: {type}</p>
        </main>
      </Layout>
    );
  }

  const isNew = slug === "new" || !slug;
  const foundCard: CardSpec | undefined = isNew
    ? { title: "New Card", content: { type: "paragraph", text: "" } }
    : dataset.cards.find((c: CardSpec) => slugify(c.title) === slug);

  return (
    <Layout>
      <main>
        <h1 style={{ marginBottom: "0.5rem" }}>
          {isNew
            ? `Create new ${dataset.title}`
            : `Edit: ${foundCard?.title || slug}`}
        </h1>

        {dataset.header && (
          <div
            className={contentStyles.contentHeader}
            style={{ marginTop: "0.5rem" }}
          >
            {dataset.header.map((h: HeaderField, i: number) => (
              <div className={contentStyles.contentHeaderItem} key={i}>
                <span className={contentStyles.label}>{h.label}</span>
                <input
                  defaultValue={h.value}
                  className={contentStyles.value}
                  style={{
                    border: "none",
                    background: "transparent",
                    textAlign: "center",
                    width: "100%",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <div className={contentStyles.itemCard} style={{ marginTop: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <div style={{ flex: 1 }}>
              <input
                defaultValue={foundCard?.title}
                placeholder="Card title"
                className={contentStyles.cardTitleInput}
              />
            </div>
            <div style={{ marginLeft: "1rem" }}>
              <button
                className={contentStyles.actionButton}
                onClick={() => {
                  try {
                    auth.setIsEditor(false);
                  } catch {}
                  navigate(-1);
                }}
              >
                Save
              </button>
            </div>
          </div>

          <div>
            {foundCard?.content ? (
              <EditableCardContent content={foundCard.content} />
            ) : (
              <p>No content (picture-only card)</p>
            )}
          </div>
        </div>

        <div style={{ marginTop: "16px" }}>
          <button
            className={contentStyles.actionButton}
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </main>
    </Layout>
  );
}
