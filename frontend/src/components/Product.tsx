import classes from "./Product.module.css";
import { memo, ReactElement, useState } from "react";
import { CartItem } from "../context/CartProvider";

interface ProductType {
  sku: string;
  name: string;
  price: number;
};

type PropsType = {
  product: ProductType;
  inCart: boolean;
  addToCart: (item: CartItem) => Promise<void>;
};

const Product = ({ product, inCart, addToCart }: PropsType): ReactElement => {
  const [isAdded, setIsAdded] = useState(false);

  const onAddToCart = async () => {
    await addToCart({
      sku: product.sku,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const img: string = new URL(`../images/${product.sku}.jpg`, import.meta.url).href;

  return (
    <article className={classes.product}>
      <h3>{product.name}</h3>
      <div className={classes.img_container}>
        <img src={img} alt={product.name} className={classes.product_img} />
      </div>
      <p>
        {new Intl.NumberFormat("en-us", {
          style: "currency",
          currency: "USD",
        }).format(product.price)}
      </p>
      <button
        onClick={onAddToCart}
        className={`${classes.addButton} ${isAdded ? classes.added : ""}`}
        disabled={inCart}
      >
        {inCart ? "Added to Cart" : isAdded ? "Added!" : "Add to Cart"}
      </button>
    </article>
  );
};

export default memo(Product);
