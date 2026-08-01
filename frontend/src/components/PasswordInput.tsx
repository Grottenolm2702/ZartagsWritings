import React from "react";
import formStyles from "../styles/form.module.css";

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 3l18 18M10.6 10.6A3 3 0 0 0 13.4 13.4M9.9 5.2A11.4 11.4 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.3 4.2M6.2 6.2A17.7 17.7 0 0 0 2 12s3.5 7 10 7c1 0 2-.2 2.9-.5"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function PasswordInput({
  className,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputClassName = className
    ? `${className} ${formStyles.passwordInputWithToggle}`
    : formStyles.passwordInputWithToggle;

  return (
    <div className={formStyles.passwordInputWrapper}>
      <input
        {...props}
        type={showPassword ? "text" : "password"}
        className={inputClassName}
      />
      <button
        type="button"
        className={formStyles.passwordToggleButton}
        aria-label={showPassword ? "Hide password" : "Show password"}
        aria-pressed={showPassword}
        onClick={() => setShowPassword((current) => !current)}
      >
        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}
