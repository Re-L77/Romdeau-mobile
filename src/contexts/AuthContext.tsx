import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";

interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      // RF1: Simulación de autenticación
      if (email === "auditor@romdeau.com" && password === "auditor123") {
        const userData: User = {
          name: "Carlos Auditor",
          email: email,
          role: "Auditor de Campo",
        };

        setUser(userData);
        setIsAuthenticated(true);

        // Guardar token de forma segura
        await SecureStore.setItemAsync(
          "auth_token",
          "mock_jwt_token_" + Date.now(),
        );
        console.log("✅ [LOG] Usuario autenticado:", email);

        return true;
      }

      return false;
    },
    [],
  );

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync("auth_token");
    setUser(null);
    setIsAuthenticated(false);
    console.log("👋 [LOG] Usuario cerró sesión");
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
