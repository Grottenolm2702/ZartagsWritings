import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { apiFetch } from "../../lib/api";
import formStyles from "../../styles/form.module.css";
import contentStyles from "../../styles/content.module.css";

type CreatedCampaign = {
  slug: string;
};

export default function CampaignCreate() {
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const created = await apiFetch<CreatedCampaign>("/api/campaigns", {
        method: "POST",
        body: JSON.stringify({
          name,
          description,
        }),
      });
      navigate(`/campaigns/${created.slug}/manage`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Campaign konnte nicht erstellt werden");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <main>
        <h1>Campaign erstellen</h1>
        <form className={formStyles.form} onSubmit={handleSubmit}>
          <label className={formStyles.formLabel} htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className={formStyles.formInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className={formStyles.formLabel} htmlFor="description">
            Beschreibung
          </label>
          <textarea
            id="description"
            className={formStyles.formInput}
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button type="submit" className={formStyles.formButton} disabled={loading}>
            {loading ? "Wird erstellt..." : "Campaign erstellen"}
          </button>
          {error ? <div className={contentStyles.errorMessage}>{error}</div> : null}
        </form>
      </main>
    </Layout>
  );
}
