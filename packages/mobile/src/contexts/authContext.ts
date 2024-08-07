import { createContext } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
