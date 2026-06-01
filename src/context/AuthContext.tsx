import React from "react";
import { DEV_ROLES } from "../config/devRoles";

type AuthContextType = {
  isEditor: boolean;
  setIsEditor: (v: boolean) => void;
  toggleEditor: () => void;
  isDungeonMaster: boolean;
  setIsDungeonMaster: (v: boolean) => void;
  toggleDungeonMaster: () => void;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isEditor, setIsEditor] = React.useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("isEditor");
      if (stored !== null) return stored === "true";
      return !!DEV_ROLES.isEditor;
    } catch {
      return !!DEV_ROLES.isEditor;
    }
  });

  const [isDungeonMaster, setIsDungeonMaster] = React.useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("isDungeonMaster");
      if (stored !== null) return stored === "true";
      return !!DEV_ROLES.isDungeonMaster;
    } catch {
      return !!DEV_ROLES.isDungeonMaster;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem("isEditor", isEditor ? "true" : "false");
    } catch {}
  }, [isEditor]);

  React.useEffect(() => {
    try {
      localStorage.setItem(
        "isDungeonMaster",
        isDungeonMaster ? "true" : "false",
      );
    } catch {}
  }, [isDungeonMaster]);

  const toggleEditor = React.useCallback(() => setIsEditor((v) => !v), []);
  const toggleDungeonMaster = React.useCallback(
    () => setIsDungeonMaster((v) => !v),
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        isEditor,
        setIsEditor,
        toggleEditor,
        isDungeonMaster,
        setIsDungeonMaster,
        toggleDungeonMaster,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
