import { useAuthContext } from "../context/AuthProvider";

export const useAuth = () => {
  const { token, user, login, logout, isLoading} = useAuthContext();
  const isAuthenticated = !!token;

  return { token, user, login, logout, isAuthenticated , isLoading};
};
