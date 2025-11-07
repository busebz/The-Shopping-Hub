import { useContext } from "react";
import CartContext from "../context/CartProvider";
import type { CartContextType } from "../context/CartProvider"; 

const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("CartContext not found");
  }
  return context;
};

export default useCart;
