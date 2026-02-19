import classes from "./Product.module.css";
import { memo, ReactElement, useState } from "react";
import { CartItem } from "../context/CartProvider";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface ProductType {
  sku: string;
  name: string;
  price: number;
}

type PropsType = {
  product: ProductType;
  inCart: boolean;
  addToCart: (item: CartItem) => Promise<void>;
};

const Product = ({ product, addToCart }: PropsType): ReactElement => {
  const [isAdded, setIsAdded] = useState(false);
  const { isUserAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onAddToCart = async () => {
    if (!isUserAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setIsAdded(true);

      await addToCart({
        sku: product.sku,
        name: product.name,
        price: product.price,
        quantity: 1,
      });

      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    } catch (err) {
      setIsAdded(false);
      console.error(err);
    }
  };

  const img: string = new URL(
    `../images/${product.sku}.jpg`,
    import.meta.url
  ).href;

  return (
    <article className={classes.product}>
      <h3>{product.name}</h3>

      <div className={classes.img_container}>
        <img src={img} alt={product.name} className={classes.product_img} />
      </div>

      <p>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(product.price)}
      </p>

      <button
        onClick={onAddToCart}
        disabled={isAdded}
        className={`${classes.addButton} ${isAdded ? classes.added : ""}`}
      >
        {isAdded ? "Added!" : "Add to Cart"}
      </button>
    </article>
  );
};

export default memo(Product);
