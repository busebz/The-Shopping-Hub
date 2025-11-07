import classes from "./CartLineItem.module.css";
import { ChangeEvent, memo, useMemo, useCallback } from "react";
import { CartItem } from "../context/CartProvider";
import useCart from "../hooks/useCart";

type PropsType = { item: CartItem };

const CartLineItem = ({ item }: PropsType) => {
  const { updateQuantity, removeFromCart } = useCart();

  const img = useMemo(
    () => new URL(`../images/${item.sku}.jpg`, import.meta.url).href,
    [item.sku]
  );

  const lineTotal = item.price * item.quantity;

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }),
    []
  );

  const options = useMemo(() => {
    const highestQty = Math.max(20, item.quantity);
    return Array.from({ length: highestQty }, (_, i) => (
      <option key={i + 1} value={i + 1}>
        {i + 1}
      </option>
    ));
  }, [item.quantity]);

  const onChangeQty = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      updateQuantity(item.sku, Number(e.target.value));
    },
    [item.sku, updateQuantity]
  );

  const onRemoveFromCart = useCallback(() => {
    removeFromCart(item.sku);
  }, [item.sku, removeFromCart]);

  return (
    <li className={classes.cart_item}>
      <div className={classes.img_container}>
        <img src={img} alt={item.name} className={classes.cart_img} />
      </div>

      <div className={classes.cart_name}>{item.name}</div>

      <div className={classes.cart_price}>
        {currencyFormatter.format(item.price)}
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
        {currencyFormatter.format(lineTotal)}
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
