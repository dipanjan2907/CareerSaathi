"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthResponse } from "@/lib/api";

interface AuthContextType {
  user: AuthResponse | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const stored = localStorage.getItem("careersaathi_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          localStorage.removeItem("careersaathi_user");
        }
      }
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const login = (data: AuthResponse) => {
    setUser(data);
    localStorage.setItem("careersaathi_user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("careersaathi_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
