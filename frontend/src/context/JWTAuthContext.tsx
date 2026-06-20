import React from "react";

export type AuthUser = { id: number; email: string; name?: string | null };

type JWTAuthContextType = {
  isLoggedIn: boolean;
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setError: (error: string | null) => void;
  loadUser: () => Promise<void>;
};

const JWTAuthContext = React.createContext<JWTAuthContextType | undefined>(
  undefined,
);

export function JWTAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(() => {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  });
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
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Login failed");
        }
        const data = await res.json();
        if (!data.token) throw new Error("No token in response");
        try {
          localStorage.setItem("token", data.token);
        } catch {
          // ignore
        }
        setToken(data.token);
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
        if (!res.ok) throw new Error(await res.text());
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

  const logout = React.useCallback(() => {
    try {
      localStorage.removeItem("token");
    } catch {
      // ignore
    }
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      if (!token) {
        setUser(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || "Failed to load user");
        }
        const userData: AuthUser = await res.json();
        if (mounted) setUser(userData);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error loading user";
        if (mounted) {
          setError(msg);
          setUser(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [token]);

  const loadUser = React.useCallback(async () => {
    if (!token) {
      setUser(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to load user");
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
  }, [token]);

  return (
    <JWTAuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
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
