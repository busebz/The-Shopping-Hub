import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartPage from "./pages/CartPage";
import ProductListPage from "./pages/ProductListPage";
import AuthPage from "./pages/AuthPage";

function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<AuthPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
