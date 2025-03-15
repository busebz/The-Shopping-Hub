import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import {ProductsProvider} from "./context/ProductsProvider.tsx";
import {CartProvider} from "./context/CartProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProductsProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ProductsProvider>
  </StrictMode>
);
