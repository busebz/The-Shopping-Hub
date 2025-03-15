import "./App.css";

import { useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import ProductList from "./components/ProductList";

function App() {
  const [viewCart, setViewCart] = useState<boolean>(false);

  const pageContent = viewCart ? <Cart /> : <ProductList />;

  return (
    <>
      <Header viewCart={viewCart} setViewCart={setViewCart}></Header>
      {pageContent}
      <Footer/>
    </>
  );
}

export default App;
