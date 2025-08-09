import classes from "./Cart.module.css";
import { useState } from "react";
import useCart from "../hooks/useCart"; 
import CartLineItem from "./CartLineItem";

const Cart = () => {
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState("");
  const {
    cart,
    totalItems,
    totalPrice,
    submitOrder,
    isLoading,
    fetchCart,
  } = useCart();

  const handleSubmit = async () => {
    try {
      await submitOrder();
      setConfirm(true);
      await fetchCart();  
    } catch (err) {
      console.error("Order submission failed:", err);
      setError("Order submission failed.");
    }
  };

  const pageContent = confirm ? (
    <h2>Thank you for your order.</h2>
  ) : (
    <>
      <ul className={classes.cart_list}>
        {cart.map((item) => (
          <CartLineItem key={item.sku} item={item} />
        ))}
      </ul>

      <div className={classes.cart_totals}>
        <p>Total Items: {totalItems}</p>
        <p>Total Price: {totalPrice}</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button
          type="button"
          className={classes.cart_submit}
          disabled={!totalItems || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Placing..." : "Place Order"}
        </button>
      </div>
    </>
  );

  return <div className={classes.cart}>{pageContent}</div>;
};

export default Cart;
