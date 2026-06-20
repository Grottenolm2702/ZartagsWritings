import React from "react";
import Layout from "../components/Layout";
import formStyles from "../styles/form.module.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) throw new Error(await res.text());
      navigate("/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <main>
        <h1>Register</h1>
        <form className={formStyles.form} onSubmit={handleSubmit}>
          <label htmlFor="name" className={formStyles.formLabel}>
            Name:
          </label>
          <input id="name" name="name" className={formStyles.formInput} required />

          <label htmlFor="email" className={formStyles.formLabel}>
            E-mail-Adresse:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="youre@email.com"
            autoComplete="email"
            className={formStyles.formInput}
            required
          />

          <label htmlFor="password" className={formStyles.formLabel}>
            Password:
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className={formStyles.formInput}
            required
            minLength={8}
            maxLength={30}
          />

          <button type="submit" className={formStyles.formButton} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          {error ? <div style={{ color: "red", marginTop: 8 }}>{error}</div> : null}
        </form>
      </main>
    </Layout>
  );
}
