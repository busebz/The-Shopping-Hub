import classes from "./Cart.module.css";
import { useState } from "react";
import useCart from "../hooks/useCart";
import CartLineItem from "./CartLineItem";

const Cart = () => {
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState("");
  const { dispatch, REDUCER_ACTIONS, totalItems, totalPrice, cart } = useCart();

  const onSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/user/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            sku: item.sku,
            name: item.name,
            price: item.price,
            quantity: item.qty, // ✅ Mongoose şemasındaki 'quantity' alanı bu
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("İstek başarısız");
      }

      const data = await response.json();
      console.log("Server response data:", data);

      dispatch({ type: REDUCER_ACTIONS.SUBMIT });
      setConfirm(true);
    } catch (error) {
      console.error("Sunucu hatası:", error);
    }
  };

  const pageContent = confirm ? (
    <h2>Thank you for your order.</h2>
  ) : (
    <>
      <ul className={classes.cart_list}>
        {cart.map((item) => (
          <CartLineItem
            key={item.sku}
            item={item}
            dispatch={dispatch}
            REDUCER_ACTIONS={REDUCER_ACTIONS}
          />
        ))}
      </ul>
      <div className={classes.cart_totals}>
        <p>Total Items: {totalItems}</p>
        <p>Total Price: {totalPrice}</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button
          type="button"
          className={classes.cart_submit}
          disabled={!totalItems}
          onClick={onSubmitOrder}
        >
          Place Order
        </button>
      </div>
    </>
  );

  return <div className={classes.cart}>{pageContent}</div>;
};

export default Cart;
