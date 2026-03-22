"use client";

import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children, initialUser }) {
  const [user, setUser] = useState(initialUser);

  const value = useMemo(
    () => ({
      user,
      setUser,
      async refreshUser() {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        setUser(data.user || null);
        return data.user || null;
      },
      async logout() {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
      },
    }),
    [user]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppProvider.");
  }

  return context;
}
