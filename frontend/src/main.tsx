import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import {CartProvider} from "./context/CartProvider.tsx";
import {AuthProvider} from "./context/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
    </AuthProvider>
  </StrictMode>
);
