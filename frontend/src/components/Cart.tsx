import classes from "./Cart.module.css";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiShoppingBag,
  FiTag,
  FiTruck,
  FiShield,
  FiRefreshCcw,
  FiHeadphones,
  FiChevronLeft,
} from "react-icons/fi";

import useCart from "../hooks/useCart";
import CartLineItem from "./CartLineItem";

const Cart = () => {
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const {
    cart,
    totalItems,
    submitOrder,
    isLoading,
    fetchCart,
  } = useCart();

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }),
    []
  );

  const calculatedTotalPrice = useMemo(() => {
    return cart.reduce((total, item) => {
      const price =
        typeof item.price === "number"
          ? item.price
          : Number(
            String(item.price ?? 0).replace(
              /[^0-9.-]+/g,
              ""
            )
          );

      const quantity = Number(item.quantity);

      const safePrice = Number.isFinite(price)
        ? price
        : 0;

      const safeQuantity = Number.isFinite(quantity)
        ? quantity
        : 0;

      return total + safePrice * safeQuantity;
    }, 0);
  }, [cart]);

  const handleSubmit = async () => {
    try {
      setError("");

      await submitOrder();

      navigate("/order-success");
    } catch (err) {
      console.error("Order submission failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Order submission failed. Please try again."
      );
    }
  };

  return (
    <main className={classes.cart}>
      <div className={classes.cartHeader}>
        <div>
          <h1>Your Cart</h1>

          <p>
            Review your items and proceed to checkout
          </p>
        </div>

        <button
          type="button"
          className={classes.continueButton}
          onClick={() => navigate("/")}
        >
          <FiChevronLeft />

          Continue Shopping
        </button>
      </div>

      {cart.length === 0 ? (
        <div className={classes.emptyCart}>
          <FiShoppingBag
            className={classes.emptyIcon}
          />

          <h2>Your cart is empty</h2>

          <p>
            Add some products to your cart to continue.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <ul className={classes.cartList}>
            {cart.map((item) => (
              <CartLineItem
                key={String(item.sku)}
                item={item}
              />
            ))}
          </ul>

          <div className={classes.cartTotals}>
            <div className={classes.totalInfo}>
              <div className={classes.totalRow}>
                <div className={classes.totalLabel}>
                  <FiShoppingBag />

                  <span>Total Items</span>
                </div>

                <strong>
                  {totalItems}
                </strong>
              </div>

              <div className={classes.totalRow}>
                <div className={classes.totalLabel}>
                  <FiTag />

                  <span>Total Price</span>
                </div>

                <strong>
                  {currencyFormatter.format(
                    calculatedTotalPrice
                  )}
                </strong>
              </div>
            </div>

            <button
              type="button"
              className={classes.cartSubmit}
              disabled={!totalItems || isLoading}
              onClick={handleSubmit}
            >
              {isLoading
                ? "Placing..."
                : "Place Order"}
            </button>
          </div>

          {error && (
            <p className={classes.error}>
              {error}
            </p>
          )}
        </>
      )}

      <div className={classes.features}>
        <div className={classes.feature}>
          <div className={classes.featureIcon}>
            <FiTruck />
          </div>

          <div className={classes.featureText}>
            <strong>Free Shipping</strong>
            <span>On orders over $50</span>
          </div>
        </div>

        <div className={classes.feature}>
          <div className={classes.featureIcon}>
            <FiShield />
          </div>

          <div className={classes.featureText}>
            <strong>Secure Payment</strong>
            <span>100% secure checkout</span>
          </div>
        </div>

        <div className={classes.feature}>
          <div className={classes.featureIcon}>
            <FiRefreshCcw />
          </div>

          <div className={classes.featureText}>
            <strong>Easy Returns</strong>
            <span>30-day return policy</span>
          </div>
        </div>

        <div className={classes.feature}>
          <div className={classes.featureIcon}>
            <FiHeadphones />
          </div>

          <div className={classes.featureText}>
            <strong>24/7 Support</strong>
            <span>We're here to help</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;