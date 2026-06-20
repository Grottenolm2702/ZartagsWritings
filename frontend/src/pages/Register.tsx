import React from "react";
import Layout from "../components/Layout";
import formStyles from "../styles/form.module.css";
import { useNavigate } from "react-router-dom";
import { useJWTAuth } from "../context/JWTAuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error, setError } = useJWTAuth();

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      await register(name, email, password);
      navigate("/login");
    } catch {
      // Error already set in context
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
