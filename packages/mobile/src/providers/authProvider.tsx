import { AuthContext } from "../contexts/authContext";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const id = SecureStore.getItem("linkId");
    if (id) {
      setIsAuthenticated(true);
    }
  }, []);

  const logout = () => {
    SecureStore.deleteItemAsync("linkId");
    setIsAuthenticated(false);
  };

  const checkAuth = () => {
    const id = SecureStore.getItem("authId");
    if (id) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const setAuth = (code: string) => {
    SecureStore.setItem("linkId", code);
    checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        checkAuth,
        setAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
