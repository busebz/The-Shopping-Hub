import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { useAuth } from "../hooks/useAuth";

const API_URL =
  import.meta.env.API_URL ||
  "https://the-shopping-hub-backend.onrender.com";

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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { userToken } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Centralized error logger
  const handleError = (error: unknown, message: string) => {
    console.error(`${message}:`, error);
  };

  // ---- API CALLS ---- //
  const getCart = async (token: string) => {
    const res = await fetch(`${API_URL}/api/user/cart`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch cart");
    const data = await res.json();
    return Array.isArray(data) ? data : data.cart ?? [];
  };

  const updateCart = async (token: string, items: CartItem[]) => {
    const res = await fetch(`${API_URL}/api/user/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) throw new Error("Failed to update cart");
  };

  const removeItem = async (token: string, sku: string) => {
    const res = await fetch(`${API_URL}/api/user/cart/${sku}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to remove item");
  };

  const updateItemQuantity = async (
    token: string,
    sku: string,
    quantity: number
  ) => {
    const res = await fetch(`${API_URL}/api/user/cart/${sku}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) throw new Error("Failed to update quantity");
  };

  const submitOrderRequest = async (token: string, items: CartItem[]) => {
    const res = await fetch(`${API_URL}/api/user/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to submit order");
    }
  };

  // ---- CONTEXT LOGIC ---- //
  const fetchCart = useCallback(async () => {
    if (!userToken) return;
    setIsLoading(true);
    try {
      const data = await getCart(userToken);
      setCart(data);
    } catch (error) {
      handleError(error, "Error fetching cart");
    } finally {
      setIsLoading(false);
    }
  }, [userToken]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const safeCart = Array.isArray(cart) ? cart : [];

  const totalItems = useMemo(
    () => safeCart.reduce((sum, item) => sum + item.quantity, 0),
    [safeCart]
  );

  const totalPrice = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(
        safeCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      ),
    [safeCart]
  );

  const calculateOrderTotal = useCallback(
    (items: CartItem[]) =>
      items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    []
  );

  // Add or update an item in cart
  const addToCart = useCallback(
    async (item: CartItem) => {
      if (!userToken) return;
      try {
        const existing = safeCart.find((i) => i.sku === item.sku);
        const updatedCart = existing
          ? safeCart.map((i) =>
              i.sku === item.sku
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          : [...safeCart, item];

        setCart(updatedCart);
        await updateCart(userToken, updatedCart);
      } catch (error) {
        handleError(error, "Error adding item to cart");
        fetchCart();
      }
    },
    [userToken, safeCart, fetchCart]
  );

  // Remove item from cart
  const removeFromCart = useCallback(
    async (sku: string) => {
      if (!userToken) return;
      try {
        setCart((prev) => prev.filter((i) => i.sku !== sku));
        await removeItem(userToken, sku);
      } catch (error) {
        handleError(error, "Error removing item");
        fetchCart();
      }
    },
    [userToken, fetchCart]
  );

  // Update item quantity
  const updateQuantity = useCallback(
    async (sku: string, quantity: number) => {
      if (!userToken) return;
      try {
        setCart((prev) =>
          prev.map((i) => (i.sku === sku ? { ...i, quantity } : i))
        );
        await updateItemQuantity(userToken, sku, quantity);
      } catch (error) {
        handleError(error, "Error updating quantity");
        fetchCart();
      }
    },
    [userToken, fetchCart]
  );

  // Submit order
  const submitOrder = useCallback(async () => {
    if (!userToken) return;
    setIsLoading(true);
    try {
      await submitOrderRequest(userToken, safeCart);
      setCart([]);
    } catch (error) {
      handleError(error, "Error submitting order");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userToken, safeCart]);

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

export default CartContext;