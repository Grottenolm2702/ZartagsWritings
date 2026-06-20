import React from "react";
import Layout from "../components/Layout";
import formStyles from "../styles/form.module.css";
import { useNavigate } from "react-router-dom";

type LoginResponse ={token?: string};

export default function Login() {
  const navigate = useNavigate();
  const [error, seterror] = React.useState<string | null>(null);
  const [loading, setloading] = React.useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    seterror(null);
    setloading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({email, password}),
      });

      if(!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "login failed");
      }
      const data: LoginResponse = await res.json();
      if(data.token) {
        try {
          localStorage.setItem("token", data.token);
        } catch {

        }
      }
      navigate("/");
    } catch(err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      seterror(message);
    } finally {
      setloading(false);
    }
  }

  return (
    <Layout>
      <main>
        <h1>Login</h1>
        <form className={formStyles.form} onSubmit= {handleSubmit}>
          <label htmlFor="email" className={formStyles.formLabel}>
            {" "}
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
            {loading ? "Logging in" : "Login"}
          </button>
          {error ? <div style={{color: "red", marginTop: 8}}>{error}</div>: null}
        </form>
      </main>
    </Layout>
  );
}
