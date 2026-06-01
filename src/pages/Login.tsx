import React from "react";
import Layout from "../components/Layout";
import formStyles from "../styles/form.module.css";

export default function Login() {
  return (
    <Layout>
      <main>
        <h1>Login</h1>
        <form className={formStyles.form}>
          <label htmlFor="email" className={formStyles.formLabel}> E-mail-Adresse:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="youre@email.com"
            autoComplete="email"
            className={formStyles.formInput}
            required
          />
          <label htmlFor="password" className={formStyles.formLabel}>Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            className={formStyles.formInput}
            required
            minLength={8}
            maxLength={30}
          />
          <button type="submit" className={formStyles.formButton}>Login</button>
        </form>
      </main>
    </Layout>
  );
}
