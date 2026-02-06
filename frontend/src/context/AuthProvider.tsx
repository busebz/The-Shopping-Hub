import { createContext, useState, useContext, ReactNode, useEffect } from "react";

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
  updateAdmin: (user: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const storage = {
  load(): {
    user: User | null;
    userToken: string | null;
    admin: User | null;
    adminToken: string | null;
  } {
    const user = localStorage.getItem("userUser");
    const userToken = localStorage.getItem("userToken");
    const admin = localStorage.getItem("adminUser");
    const adminToken = localStorage.getItem("adminToken");

    return {
      user: user ? JSON.parse(user) : null,
      userToken: userToken || null,
      admin: admin ? JSON.parse(admin) : null,
      adminToken: adminToken || null,
    };
  },

  clear(role: UserRole) {
    if (role === "ADMIN") {
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminToken");
    } else {
      localStorage.removeItem("userUser");
      localStorage.removeItem("userToken");
    }
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<User | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { user, userToken, admin, adminToken } = storage.load();
    setUser(user);
    setUserToken(userToken);
    setAdmin(admin);
    setAdminToken(adminToken);
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
    storage.clear("USER");
  };

  const logoutAdmin = () => {
    setAdmin(null);
    setAdminToken(null);
    storage.clear("ADMIN");
  };

  const updateUser = (updated: User) => {
    if (updated.role === "USER") {
      setUser(updated);
      localStorage.setItem("userUser", JSON.stringify(updated));
    } else {
      setAdmin(updated);
      localStorage.setItem("adminUser", JSON.stringify(updated));
    }
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
        updateAdmin: updateUser,
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
