import React from "react";

export type AuthUser = { id: number; email: string; name?: string | null };

type JWTAuthContextType = {
  isLoggedIn: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setError: (error: string | null) => void;
  loadUser: () => Promise<void>;
};

function extractErrorMessage(text: string): string {
  try {
    const json = JSON.parse(text);
    return json.error || text;
  } catch {
    return text;
  }
}

export function getErrorMessage(text: string): string {
  return extractErrorMessage(text);
}

const JWTAuthContext = React.createContext<JWTAuthContextType | undefined>(
  undefined,
);

export function JWTAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const login = React.useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(extractErrorMessage(txt));
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const register = React.useCallback(
    async (name: string, email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) throw new Error(extractErrorMessage(await res.text()));
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Registration failed";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const logout = React.useCallback(async () => {
    setLoading(true);
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore
    } finally {
      setUser(null);
      setError(null);
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/user", {
          credentials: "include",
        });
        if (!res.ok) {
          // Don't set error on init if not logged in (401)
          return;
        }
        const userData: AuthUser = await res.json();
        if (mounted) setUser(userData);
      } catch (err) {
        // Silently ignore init errors
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const loadUser = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user", {
        credentials: "include",
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(extractErrorMessage(errText) || "Failed to load user");
      }
      const userData: AuthUser = await res.json();
      setUser(userData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error loading user";
      setError(msg);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <JWTAuthContext.Provider
      value={{
        isLoggedIn: !!user,
        user,
        loading,
        error,
        login,
        register,
        logout,
        setError,
        loadUser,
      }}
    >
      {children}
    </JWTAuthContext.Provider>
  );
}

export function useJWTAuth() {
  const ctx = React.useContext(JWTAuthContext);
  if (!ctx) throw new Error("useJWTAuth must be used within JWTAuthProvider");
  return ctx;
}
