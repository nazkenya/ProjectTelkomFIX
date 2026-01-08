import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const STORAGE_KEY = "app_user";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user saat aplikasi dibuka
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  function setUserAndPersist(data) {
    setUser(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  // helper: cek role
  const hasRole = useCallback(
    (allowed) => {
      if (!user?.role) return false;
      const arr = Array.isArray(allowed) ? allowed : [allowed];
      return arr.includes(user.role);
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      loading,
      setUser: setUserAndPersist,
      logout,
      isAuthenticated: !!user,
      hasRole,
    }),
    [user, loading, hasRole]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
