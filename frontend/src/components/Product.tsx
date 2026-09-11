import { memo, useState } from "react";
import classes from "./Product.module.css";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";

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

    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <article className={classes.product}>
      <div className={classes.img_container}>
        <img
          src={product.image}
          alt={product.name}
          className={classes.product_img}
        />
      </div>

      <p>{product.name}</p>

      <h3>${product.price}</h3>

      <button
        onClick={onAddToCart}
        disabled={isAdded}
        className={isAdded ? classes.addedButton : ""}
      >
        <FaCartShopping />

        {isAdded ? "Added!" : "Add To Cart"}
      </button>
    </article>
  );
};

export default memo(Product);