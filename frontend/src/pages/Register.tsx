import React from "react";
import Layout from "../components/Layout";
import PasswordInput from "../components/PasswordInput";
import formStyles from "../styles/form.module.css";
import { useNavigate } from "react-router-dom";
import { useJWTAuth } from "../context/JWTAuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error, setError } = useJWTAuth();

  const [password, setPassword] = React.useState("");
  const [repeatPassword, setRepeatPassword] = React.useState("");

  const passwordRules = React.useMemo(() => {
    return [
      { id: "lower", label: "mindestens einen Kleinbuchstaben", test: /\p{Ll}/u },
      { id: "upper", label: "mindestens einen Großbuchstaben", test: /\p{Lu}/u },
      { id: "digit", label: "mindestens eine Zahl", test: /\d/ },
      { id: "length", label: "8–30 Zeichen lang", test: /^.{8,30}$/ },
    ];
  }, []);

  const passwordRegex = /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d)[\p{L}\d]{8,30}$/u;

  const satisfied = passwordRules.map((r) => r.test.test(password));
  const satisfiedCount = satisfied.filter(Boolean).length;
  const progress = Math.round((satisfiedCount / passwordRules.length) * 100);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const pwd = formData.get("password") as string;
    const rpt = formData.get("repeatPassword") as string;

    if (pwd !== rpt) {
      setError("Passwörter stimmen nicht überein");
      return;
    }

    // Validate password against stricter client-side rules
    if (!passwordRegex.test(pwd)) {
      setError("Passwort erfüllt nicht alle Anforderungen. Siehe Hinweise unter dem Feld.");
      return;
    }

    try {
      await register(name, email, pwd);
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
            placeholder="your@email.com"
            autoComplete="email"
            className={formStyles.formInput}
            required
          />

          <label htmlFor="password" className={formStyles.formLabel}>
            Password:
          </label>
          <PasswordInput
            name="password"
            id="password"
            className={formStyles.formInput}
            required
            minLength={8}
            maxLength={30}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />

          <section className={formStyles.passwordRules} aria-label="Passwort Anforderungen">
            <p>Passwort-Anforderungen</p>
            <div className={formStyles.progressBar} aria-hidden="true">
              <div
                className={progress === 100 ? formStyles.progressFill : formStyles.progressFillIncomplete}
                style={{ width: `${progress}%` }}
              />
            </div>
            <ul className={formStyles.ruleList}>
              {passwordRules.map((r, idx) => (
                <li key={r.id} className={`${formStyles.ruleItem} ${satisfied[idx] ? formStyles.satisfied : ""}`}>
                  <span className={formStyles.ruleIcon} aria-hidden="true">{satisfied[idx] ? "✓" : "○"}</span>
                  {r.label}
                </li>
              ))}
            </ul>
          </section>

          <label htmlFor="repeatPassword" className={formStyles.formLabel}>
            Password wiederholen:
          </label>
          <PasswordInput
            name="repeatPassword"
            id="repeatPassword"
            className={formStyles.formInput}
            required
            minLength={8}
            maxLength={30}
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            autoComplete="new-password"
          />

          <button type="submit" className={formStyles.formButton} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          {error ? <div className={formStyles.errorMessage} role="alert">{error}</div> : null}
        </form>
      </main>
    </Layout>
  );
}
