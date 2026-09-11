import classes from "./CartLineItem.module.css";

import {
  ChangeEvent,
  memo,
  useMemo,
  useCallback,
} from "react";

import { FiTrash2 } from "react-icons/fi";

import { CartItem } from "../context/CartProvider";

import useCart from "../hooks/useCart";

type PropsType = {
  item: CartItem;
};

const productImages = import.meta.glob(
  "../images/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  {
    eager: true,
    import: "default",
  }
) as Record<string, string>;

const CartLineItem = ({
  item,
}: PropsType) => {
  const {
    updateQuantity,
    removeFromCart,
  } = useCart();

  const image = useMemo(() => {
    const sku = String(
      item.sku ?? ""
    )
      .trim()
      .toLowerCase();

    const imagePath = Object.keys(
      productImages
    ).find((path) => {
      const fileName = path
        .split("/")
        .pop()
        ?.replace(
          /\.(jpg|jpeg|png|webp)$/i,
          ""
        )
        .trim()
        .toLowerCase();

      return fileName === sku;
    });

    return imagePath
      ? productImages[imagePath]
      : "";
  }, [item.sku]);

  const itemPrice = useMemo(() => {
    if (
      typeof item.price === "number"
    ) {
      return item.price;
    }

    const parsed = Number(
      String(
        item.price ?? 0
      ).replace(
        /[^0-9.-]+/g,
        ""
      )
    );

    return Number.isFinite(parsed)
      ? parsed
      : 0;
  }, [item.price]);

  const quantity =
    Number(item.quantity) || 1;

  const lineTotal =
    itemPrice * quantity;

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }),
    []
  );

  const options = useMemo(() => {
    const highestQty = Math.max(
      20,
      quantity
    );

    return Array.from(
      {
        length: highestQty,
      },
      (_, index) => {
        const value = index + 1;

        return (
          <option
            key={value}
            value={value}
          >
            {value}
          </option>
        );
      }
    );
  }, [quantity]);

  const onChangeQty = useCallback(
    (
      e: ChangeEvent<HTMLSelectElement>
    ) => {
      updateQuantity(
        item.sku,
        Number(e.target.value)
      );
    },
    [
      item.sku,
      updateQuantity,
    ]
  );

  const onRemoveFromCart =
    useCallback(() => {
      removeFromCart(item.sku);
    }, [
      item.sku,
      removeFromCart,
    ]);

  return (
    <li className={classes.cartItem}>
      <div className={classes.product}>
        <div
          className={
            classes.imgContainer
          }
        >
          {image ? (
            <img
              src={image}
              alt={item.name}
              className={
                classes.cartImg
              }
            />
          ) : (
            <div
              className={
                classes.imagePlaceholder
              }
            >
              No Image
            </div>
          )}
        </div>

        <div
          className={
            classes.productInfo
          }
        >
          <h3>
            {item.name}
          </h3>

          <span>
            {currencyFormatter.format(
              itemPrice
            )}
          </span>
        </div>
      </div>

      <div className={classes.quantity}>
        <select
          name={`itemQty-${String(
            item.sku
          )}`}
          id={`itemQty-${String(
            item.sku
          )}`}
          className={
            classes.cartSelect
          }
          value={quantity}
          aria-label={`${item.name} quantity`}
          onChange={onChangeQty}
        >
          {options}
        </select>
      </div>

      <div className={classes.subtotal}>
        {currencyFormatter.format(
          lineTotal
        )}
      </div>

      <div className={classes.remove}>
        <button
          type="button"
          className={
            classes.cartButton
          }
          aria-label={`Remove ${item.name} from cart`}
          title="Remove Item From Cart"
          onClick={
            onRemoveFromCart
          }
        >
          <FiTrash2 />
        </button>
      </div>
    </li>
  );
};

function areItemsEqual(
  {
    item: prevItem,
  }: PropsType,
  {
    item: nextItem,
  }: PropsType
) {
  return (
    prevItem.sku ===
      nextItem.sku &&
    prevItem.name ===
      nextItem.name &&
    prevItem.quantity ===
      nextItem.quantity &&
    prevItem.price ===
      nextItem.price
  );
}

export default memo(
  CartLineItem,
  areItemsEqual
);