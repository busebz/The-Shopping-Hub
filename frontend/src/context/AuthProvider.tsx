import { createContext, useState, useContext, ReactNode, useEffect } from "react";

export type User = {
  id: string;
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
  updateUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const storage = {
  save: (user: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  },
  clear: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },
  load: () => {
    const token = localStorage.getItem("token") || null;
    let user = null;

    try {
      const userData = localStorage.getItem("user");

      if (userData && userData !== "undefined") {
        user = JSON.parse(userData);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }

    return { token, user };
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { token, user } = storage.load();
    if (token && user) {
      setUser(user);
      setToken(token);
    }
    setIsLoading(false);
  }, []);

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    storage.save(user, token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    storage.clear();
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext not found");
  return context;
};
