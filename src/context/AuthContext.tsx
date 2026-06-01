import React from "react";

type AuthContextType = {
  isEditor: boolean;
  setIsEditor: (v: boolean) => void;
  toggleEditor: () => void;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isEditor, setIsEditor] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem("isEditor") === "true";
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem("isEditor", isEditor ? "true" : "false");
    } catch {}
  }, [isEditor]);

  const toggleEditor = React.useCallback(() => setIsEditor((v) => !v), []);

  return (
    <AuthContext.Provider value={{ isEditor, setIsEditor, toggleEditor }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
