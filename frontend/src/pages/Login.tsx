import React from "react";
import Layout from "../components/Layout";
import PasswordInput from "../components/PasswordInput";
import formStyles from "../styles/form.module.css";
import { useNavigate } from "react-router-dom";
import { useJWTAuth } from "../context/JWTAuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error, setError } = useJWTAuth();

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      await login(email, password);
      navigate("/");
    } catch {
      // Error already set in context
    }
  }

  return (
    <Layout>
      <main>
        <h1>Login</h1>
        <form className={formStyles.form} onSubmit={handleSubmit}>
          <label htmlFor="email" className={formStyles.formLabel}>
            Email: <span className={formStyles.requiredMark}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your@email.com"
            autoComplete="email"
            className={formStyles.formInput}
            aria-invalid={error ? true : undefined}
            required
          />
          <label htmlFor="password" className={formStyles.formLabel}>
            Password: <span className={formStyles.requiredMark}>*</span>
          </label>
          <PasswordInput
            name="password"
            id="password"
            className={formStyles.formInput}
            aria-invalid={error ? true : undefined}
            required
            minLength={8}
            maxLength={30}
          />
          <button type="submit" className={formStyles.formButton} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          {error ? <div className={formStyles.errorMessage} role="alert">{error}</div> : null}
        </form>
      </main>
    </Layout>
  );
}
