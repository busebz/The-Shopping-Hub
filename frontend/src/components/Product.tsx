import { memo, useState } from "react";
import classes from "./Product.module.css";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

type ProductType = {
  sku: string;
  name: string;
  price: number;
  image: string;
};

type Props = {
  product: ProductType;
  inCart: boolean;
  addToCart: (item: any) => Promise<void>;
};

const Product = ({ product, addToCart }: Props) => {
  const [isAdded, setIsAdded] = useState(false);
  const { isUserAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onAddToCart = async () => {
    if (!isUserAuthenticated) {
      navigate("/login");
      return;
    }

    setIsAdded(true);

    await addToCart({
      sku: product.sku,
      name: product.name,
      price: product.price,
      quantity: 1,
    });

    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <article className={classes.product}>
      <h3>{product.name}</h3>

      <div className={classes.img_container}>
        <img
          src={product.image}
          alt={product.name}
          className={classes.product_img}
        />
      </div>

      <p>${product.price}</p>

      <button onClick={onAddToCart} disabled={isAdded}>
        {isAdded ? "Added!" : "Add to Cart"}
      </button>
    </article>
  );
};

export default memo(Product);