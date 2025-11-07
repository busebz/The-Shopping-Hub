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

import { useAuth } from "../src/hooks/useAuth";

/** Protects routes that require authentication */
const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const { pathname } = useLocation();
  const hideLayout = pathname === "/login";

  if (isLoading) return null;

  return (
    <>
      {!hideLayout && <Header />}

      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />}
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
