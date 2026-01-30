import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import CartPage from "./pages/CartPage";
import ProductListPage from "./pages/ProductListPage";
import AuthPage from "./pages/AuthPage";
import OrdersPage from "./pages/OrdersPage";
import UserInfoSettingsPage from "./pages/UserInfoSettingsPage";

import AdminLoginPage from "./pages/Admin/Login";
import AdminDashboardPage from "./pages/Admin/Dashboard";

import { useAuth } from "./hooks/useAuth";

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

const AdminProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return element;
};

function AppContent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { pathname } = useLocation();

  const hideLayout =
    pathname === "/login" || pathname.startsWith("/admin");

  if (isLoading) return null;

  return (
    <>
      {!hideLayout && <Header />}

      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              user?.role === "ADMIN" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <AuthPage />
            )
          }
        />

        <Route path="/" element={<ProductListPage />} />

        <Route
          path="/cart"
          element={<ProtectedRoute element={<CartPage />} />}
        />

        <Route
          path="/orders"
          element={<ProtectedRoute element={<OrdersPage />} />}
        />

        <Route
          path="/userinfo"
          element={<ProtectedRoute element={<UserInfoSettingsPage />} />}
        />

        <Route
          path="/admin/login"
          element={
            isAuthenticated && user?.role === "ADMIN" ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <AdminLoginPage />
            )
          }
        />

        <Route
          path="/admin/dashboard"
          element={<AdminProtectedRoute element={<AdminDashboardPage />} />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
