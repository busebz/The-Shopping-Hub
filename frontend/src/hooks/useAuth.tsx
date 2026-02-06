import { useAuthContext } from "../context/AuthProvider";

export const useAuth = () => {
  const {
    user,
    userToken,
    isUserAuthenticated,
    admin,
    adminToken,
    isAdminAuthenticated,
    isLoading,
    loginUser,
    loginAdmin,
    logoutUser,
    logoutAdmin,
    updateUser,
    updateAdmin,
  } = useAuthContext();

  return {
    user,
    userToken,
    isUserAuthenticated,
    loginUser,
    logoutUser,
    updateUser,
    admin,
    adminToken,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    updateAdmin,

    isLoading,
  };
};
