import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  ReactNode,
} from "react";
import { useAuth } from "../hooks/useAuth";

export interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  totalItems: number;
  totalPrice: string;
  isLoading: boolean;
  calculateOrderTotal: (items: CartItem[]) => number;
  fetchCart: () => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (sku: string) => Promise<void>;
  updateQuantity: (sku: string, quantity: number) => Promise<void>;
  submitOrder: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const { token } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchCart = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        "https://the-shopping-hub-backend-production.up.railway.app/api/user/cart",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCart(Array.isArray(data) ? data : data.cart ?? []);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const safeCart = Array.isArray(cart) ? cart : [];

  const totalItems = safeCart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(
    safeCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  const calculateOrderTotal = (items: CartItem[]) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const addToCart = async (item: CartItem) => {
    if (!token) return;
    try {
      let updatedCart = [...cart];
      const index = updatedCart.findIndex((i) => i.sku === item.sku);
      if (index !== -1) {
        updatedCart[index].quantity += item.quantity;
      } else {
        updatedCart.push(item);
      }
      const res = await fetch(
        "https://the-shopping-hub-backend-production.up.railway.app/api/user/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items: updatedCart }),
        }
      );
      if (!res.ok) throw new Error("Failed to add item");
      await fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromCart = async (sku: string) => {
    if (!token) return;
    try {
      const res = await fetch(
        `https://the-shopping-hub-backend-production.up.railway.app/api/user/cart/${sku}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to remove item");
      await fetchCart();
    } catch (error) {}
  };

  const updateQuantity = async (sku: string, quantity: number) => {
    if (!token) return;
    try {
      const res = await fetch(
        `https://the-shopping-hub-backend-production.up.railway.app/api/user/cart/${sku}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity }),
        }
      );
      if (!res.ok) throw new Error("Failed to update quantity");
      await fetchCart();
    } catch (error) {}
  };

  const submitOrder = async () => {
    if (!token) return;
    try {
      const res = await fetch(
        "https://the-shopping-hub-backend-production.up.railway.app/api/user/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items: safeCart }),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit order");
      }
      await fetchCart();
    } catch (error) {
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart: safeCart,
        totalItems,
        totalPrice,
        isLoading,
        calculateOrderTotal,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        submitOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
