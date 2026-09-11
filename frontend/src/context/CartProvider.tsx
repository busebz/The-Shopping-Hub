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
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

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

const CartContext =
  createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { userToken } = useAuth();

  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const handleError = (
    error: unknown,
    message: string
  ) => {
    console.error(
      `${message}:`,
      error
    );
  };

  // -------------------------
  // GET CART
  // -------------------------
  const getCart = async (
    token: string
  ) => {
    const res = await fetch(
      `${API_URL}/api/user/cart`,
      {
        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const text =
        await res.text();

      console.error(
        "Get cart response:",
        res.status,
        text
      );

      throw new Error(
        "Failed to fetch cart"
      );
    }

    const data =
      await res.json();

    return Array.isArray(data)
      ? data
      : data.cart ?? [];
  };

  // -------------------------
  // UPDATE CART
  // -------------------------
  const updateCart = async (
    token: string,
    items: CartItem[]
  ) => {
    const res = await fetch(
      `${API_URL}/api/user/cart`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify({
          items,
        }),
      }
    );

    if (!res.ok) {
      const text =
        await res.text();

      console.error(
        "Update cart response:",
        res.status,
        text
      );

      throw new Error(
        "Failed to update cart"
      );
    }
  };

  // -------------------------
  // REMOVE ITEM
  // -------------------------
  const removeItem = async (
    token: string,
    sku: string
  ) => {
    const res = await fetch(
      `${API_URL}/api/user/cart/${sku}`,
      {
        method: "DELETE",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const text =
        await res.text();

      console.error(
        "Remove item response:",
        res.status,
        text
      );

      throw new Error(
        "Failed to remove item"
      );
    }
  };

  // -------------------------
  // UPDATE QUANTITY
  // -------------------------
  const updateItemQuantity =
    async (
      token: string,
      sku: string,
      quantity: number
    ) => {
      const res = await fetch(
        `${API_URL}/api/user/cart/${sku}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            quantity,
          }),
        }
      );

      if (!res.ok) {
        const text =
          await res.text();

        console.error(
          "Update quantity response:",
          res.status,
          text
        );

        throw new Error(
          "Failed to update quantity"
        );
      }
    };

  // -------------------------
  // SUBMIT ORDER
  // -------------------------
  const submitOrderRequest =
    async (
      token: string,
      items: CartItem[]
    ) => {
      console.log(
        "Submitting order to:",
        `${API_URL}/api/user/orders`
      );

      console.log(
        "Order items:",
        items
      );

      const res = await fetch(
        `${API_URL}/api/user/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            items,
          }),
        }
      );

      if (!res.ok) {
        const responseText =
          await res.text();

        console.error(
          "Submit order failed:",
          res.status,
          res.statusText,
          responseText
        );

        let errorMessage =
          "Failed to submit order";

        try {
          const parsed =
            JSON.parse(
              responseText
            );

          if (parsed.message) {
            errorMessage =
              parsed.message;
          }
        } catch {
          if (responseText) {
            errorMessage =
              responseText;
          }
        }

        throw new Error(
          errorMessage
        );
      }

      if (
        res.status !== 204
      ) {
        try {
          return await res.json();
        } catch {
          return null;
        }
      }

      return null;
    };

  // -------------------------
  // FETCH CART
  // -------------------------
  const fetchCart =
    useCallback(
      async () => {
        if (!userToken)
          return;

        setIsLoading(true);

        try {
          const data =
            await getCart(
              userToken
            );

          setCart(data);
        } catch (error) {
          handleError(
            error,
            "Error fetching cart"
          );
        } finally {
          setIsLoading(false);
        }
      },
      [userToken]
    );

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const safeCart =
    Array.isArray(cart)
      ? cart
      : [];

  // -------------------------
  // TOTAL ITEMS
  // -------------------------
  const totalItems =
    useMemo(
      () =>
        safeCart.reduce(
          (
            sum,
            item
          ) =>
            sum +
            Number(
              item.quantity
            ),
          0
        ),
      [safeCart]
    );

  // -------------------------
  // TOTAL PRICE
  // -------------------------
  const totalPrice =
    useMemo(() => {
      const total =
        safeCart.reduce(
          (
            sum,
            item
          ) => {
            const price =
              Number(
                item.price
              ) || 0;

            const quantity =
              Number(
                item.quantity
              ) || 0;

            return (
              sum +
              price *
                quantity
            );
          },
          0
        );

      return new Intl.NumberFormat(
        "en-US",
        {
          style:
            "currency",

          currency:
            "USD",
        }
      ).format(total);
    }, [safeCart]);

  const calculateOrderTotal =
    useCallback(
      (
        items: CartItem[]
      ) =>
        items.reduce(
          (
            sum,
            item
          ) =>
            sum +
            Number(
              item.price
            ) *
              Number(
                item.quantity
              ),
          0
        ),
      []
    );

  // -------------------------
  // ADD TO CART
  // -------------------------
  const addToCart =
    useCallback(
      async (
        item: CartItem
      ) => {
        if (!userToken)
          return;

        try {
          const existing =
            safeCart.find(
              (i) =>
                i.sku ===
                item.sku
            );

          const updatedCart =
            existing
              ? safeCart.map(
                  (i) =>
                    i.sku ===
                    item.sku
                      ? {
                          ...i,

                          quantity:
                            Number(
                              i.quantity
                            ) +
                            Number(
                              item.quantity
                            ),
                        }
                      : i
                )
              : [
                  ...safeCart,
                  {
                    ...item,

                    quantity:
                      Number(
                        item.quantity
                      ) || 1,
                  },
                ];

          setCart(
            updatedCart
          );

          await updateCart(
            userToken,
            updatedCart
          );
        } catch (error) {
          handleError(
            error,
            "Error adding item to cart"
          );

          fetchCart();
        }
      },
      [
        userToken,
        safeCart,
        fetchCart,
      ]
    );

  // -------------------------
  // REMOVE FROM CART
  // -------------------------
  const removeFromCart =
    useCallback(
      async (
        sku: string
      ) => {
        if (!userToken)
          return;

        try {
          setCart(
            (
              prev
            ) =>
              prev.filter(
                (i) =>
                  i.sku !==
                  sku
              )
          );

          await removeItem(
            userToken,
            sku
          );
        } catch (error) {
          handleError(
            error,
            "Error removing item"
          );

          fetchCart();
        }
      },
      [
        userToken,
        fetchCart,
      ]
    );

  // -------------------------
  // UPDATE QUANTITY
  // -------------------------
  const updateQuantity =
    useCallback(
      async (
        sku: string,
        quantity: number
      ) => {
        if (!userToken)
          return;

        try {
          setCart(
            (
              prev
            ) =>
              prev.map(
                (i) =>
                  i.sku ===
                  sku
                    ? {
                        ...i,
                        quantity,
                      }
                    : i
              )
          );

          await updateItemQuantity(
            userToken,
            sku,
            quantity
          );
        } catch (error) {
          handleError(
            error,
            "Error updating quantity"
          );

          fetchCart();
        }
      },
      [
        userToken,
        fetchCart,
      ]
    );

  // -------------------------
  // SUBMIT ORDER
  // -------------------------
  const submitOrder =
    useCallback(
      async () => {
        if (!userToken) {
          throw new Error(
            "User token not found"
          );
        }

        if (
          safeCart.length ===
          0
        ) {
          throw new Error(
            "Cart is empty"
          );
        }

        setIsLoading(true);

        try {
          await submitOrderRequest(
            userToken,
            safeCart
          );

          setCart([]);
        } catch (error) {
          handleError(
            error,
            "Error submitting order"
          );

          throw error;
        } finally {
          setIsLoading(false);
        }
      },
      [
        userToken,
        safeCart,
      ]
    );

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