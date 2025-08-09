import classes from "./CartLineItem.module.css";

import { ChangeEvent, ReactElement, memo } from "react";
import { CartItem } from "../context/CartProvider";
import useCart from "../hooks/useCart";

type PropsType = {
  item: CartItem;
};

const CartLineItem = ({ item }: PropsType) => {
  const { updateQuantity, removeFromCart } = useCart();

  const img: string = new URL(`../images/${item.sku}.jpg`, import.meta.url).href;
  const lineTotal: number = item.price * item.quantity;
  const highestQty: number = Math.max(20, item.quantity);

  const optionValues: number[] = [...Array(highestQty).keys()].map(i => i + 1);
  const options: ReactElement[] = optionValues.map(val => (
    <option key={`opt_${val}`} value={val}>
      {val}
    </option>
  ));

  const onChangeQty = (e: ChangeEvent<HTMLSelectElement>) => {
    updateQuantity(item.sku, Number(e.target.value));
  };

  const onRemoveFromCart = () => {
    removeFromCart(item.sku);
  };

  return (
    <li className={classes.cart_item}>
      <div className={classes.img_container}>
        <img src={img} alt={item.name} className={classes.cart_img} />
      </div>

      <div className={classes.cart_name}>{item.name}</div>

      <div className={classes.cart_price}>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(item.price)}
      </div>
      <select
        name="itemQty"
        id="itemQty"
        className={classes.cart_select}
        value={item.quantity}
        aria-label="Item Quantity"
        onChange={onChangeQty}
      >
        {options}
      </select>

      <div className={classes.cart_item_subtotal}>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(lineTotal)}
      </div>

      <button
        className={classes.cart_button}
        aria-label="Remove Item From Cart"
        title="Remove Item From Cart"
        onClick={onRemoveFromCart}
      >
        ❌
      </button>
    </li>
  );
};

function areItemsEqual(
  { item: prevItem }: PropsType,
  { item: nextItem }: PropsType
) {
  return (
    prevItem.sku === nextItem.sku &&
    prevItem.quantity === nextItem.quantity &&
    prevItem.price === nextItem.price
  );
}

export default memo(CartLineItem, areItemsEqual);
