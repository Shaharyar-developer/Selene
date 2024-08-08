import { createContext } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  checkAuth: () => boolean;
  setAuth: (code: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
