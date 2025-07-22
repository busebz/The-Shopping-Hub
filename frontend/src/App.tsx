import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import CartPage from "./pages/CartPage";
import ProductListPage from "./pages/ProductListPage";
import AuthPage from "./pages/AuthPage";
import OrdersPage from "./components/Orders";

import { useAuth } from "../src/hooks/useAuth";

function AppContent() {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const hideLayout = location.pathname === "/login";

  if (isLoading) return null;

  return (
    <>
      {!hideLayout && <Header />}

      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />}
        />
        <Route
          path="/cart"
          element={isAuthenticated ? <CartPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/orders"
          element={isAuthenticated ? <OrdersPage /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
