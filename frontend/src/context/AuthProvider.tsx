import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

export type UserRole = "USER" | "ADMIN";

export type User = {
  id: string;
  username?: string;
  email: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  userToken: string | null;
  isUserAuthenticated: boolean;

  admin: User | null;
  adminToken: string | null;
  isAdminAuthenticated: boolean;

  isLoading: boolean;

  loginUser: (user: User, token: string) => void;
  loginAdmin: (user: User, token: string) => void;

  logoutUser: () => void;
  logoutAdmin: () => void;

  updateUser: (user: User) => void;
  updateAdmin: (admin: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);

  const [admin, setAdmin] = useState<User | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("userUser");
    const storedUserToken = localStorage.getItem("userToken");
    const storedAdmin = localStorage.getItem("adminUser");
    const storedAdminToken = localStorage.getItem("adminToken");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedUserToken) setUserToken(storedUserToken);

    if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
    if (storedAdminToken) setAdminToken(storedAdminToken);

    setIsLoading(false);
  }, []);

  const loginUser = (u: User, token: string) => {
    setUser(u);
    setUserToken(token);
    localStorage.setItem("userUser", JSON.stringify(u));
    localStorage.setItem("userToken", token);
  };

  const loginAdmin = (a: User, token: string) => {
    setAdmin(a);
    setAdminToken(token);
    localStorage.setItem("adminUser", JSON.stringify(a));
    localStorage.setItem("adminToken", token);
  };

  const logoutUser = () => {
    setUser(null);
    setUserToken(null);
    localStorage.removeItem("userUser");
    localStorage.removeItem("userToken");
  };

  const logoutAdmin = () => {
    setAdmin(null);
    setAdminToken(null);
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    localStorage.setItem("userUser", JSON.stringify(updated));
  };

  const updateAdmin = (updated: User) => {
    setAdmin(updated);
    localStorage.setItem("adminUser", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userToken,
        isUserAuthenticated: !!userToken,
        admin,
        adminToken,
        isAdminAuthenticated: !!adminToken,
        isLoading,
        loginUser,
        loginAdmin,
        logoutUser,
        logoutAdmin,
        updateUser,
        updateAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext not found");
  return context;
};
