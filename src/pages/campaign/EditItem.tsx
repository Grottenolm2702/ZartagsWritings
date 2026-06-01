import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import raw from "../../data/exampleData.json";
import Layout from "../../components/Layout";
import EditableCardContent from "../../components/campaign/EditableCardContent";
import { useAuth } from "../../context/AuthContext";

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

  const dataset: any = (raw as any)[key];
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
  const foundCard = isNew
    ? { title: "New Card", content: { type: "paragraph", text: "" } }
    : dataset.cards.find((c: any) => slugify(c.title) === slug);

  return (
    <Layout>
      <main>
        <h1 style={{ marginBottom: "0.5rem" }}>
          {isNew
            ? `Create new ${dataset.title}`
            : `Edit: ${foundCard?.title || slug}`}
        </h1>

        {dataset.header && (
          <div className="content-header" style={{ marginTop: "0.5rem" }}>
            {dataset.header.map((h: any, i: number) => (
              <div className="content-header-item" key={i}>
                <span className="label">{h.label}</span>
                <input
                  defaultValue={h.value}
                  className="value"
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

        <div className="item-card" style={{ marginTop: "1rem" }}>
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
                style={{
                  width: "100%",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  border: "none",
                  background: "transparent",
                }}
              />
            </div>
            <div style={{ marginLeft: "1rem" }}>
              <button
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
          <button onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </main>
    </Layout>
  );
}
