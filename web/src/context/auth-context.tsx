"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { apiClient, type User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("taskmanager_user");
    const savedToken = localStorage.getItem("taskmanager_token");

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        apiClient.setToken(savedToken);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        localStorage.removeItem("taskmanager_user");
        localStorage.removeItem("taskmanager_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.login(email, password);

      const userData = response.data;
      setUser(userData);

      apiClient.setToken(response.token);
      localStorage.setItem("taskmanager_user", JSON.stringify(userData));

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Erro no login:", error);
      setError(error instanceof Error ? error.message : "Erro no login");
      setIsLoading(false);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.register(name, email, password);

      const userData = response.data;
      setUser(userData);

      apiClient.setToken(response.token);
      localStorage.setItem("taskmanager_user", JSON.stringify(userData));

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Erro no registro:", error);
      setError(error instanceof Error ? error.message : "Erro no registro");
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    apiClient.clearToken();
    localStorage.removeItem("taskmanager_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isLoading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "Verifique se seu component está por volta de um <AuthProvider>"
    );
  }
  return context;
}
