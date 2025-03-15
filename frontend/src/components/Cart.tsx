import classes from "./Cart.module.css"

import { useState } from "react";
import useCart from "../hooks/useCart";
import CartLineItem from "./CartLineItem";

const Cart = () => {
  const [confirm, setConfirm] = useState<boolean>(false);
  const { dispatch, REDUCER_ACTIONS, totalItems, totalPrice, cart } = useCart();

  const onSubmitOrder = () => {
    dispatch({ type: REDUCER_ACTIONS.SUBMIT }), setConfirm(true);
  };          

  const pageContent = confirm ? (
    <h2>Thank you for order.</h2>
  ) : (
    <>
      <ul className={classes.cart_list}>
        {cart.map((item) => {
          return (
            <CartLineItem
              key={item.sku}
              item={item}
              dispatch={dispatch}
              REDUCER_ACTIONS={REDUCER_ACTIONS}
            />
          );
        })}
      </ul>
      <div className={classes.cart_totals}>
        <p>Total Items: {totalItems}</p>
        <p>Total Price: {totalPrice}</p>
        <button
          className={classes.cart_submit}
          disabled={!totalItems}
          onClick={onSubmitOrder}
        >
          Place Order
        </button>
      </div>
    </>
  );

  const content = <div className={classes.cart}>{pageContent}</div>;

  return content
};

export default Cart;
