import classes from "./Product.module.css";
import { ProductType } from "../context/ProductsProvider";
import { ReducerActionType, ReducerAction } from "../context/CartProvider";
import { memo, ReactElement, useState } from "react";

type PropsType = {
  product: ProductType;
  dispatch: React.Dispatch<ReducerAction>;
  REDUCER_ACTIONS: ReducerActionType;
  inCart: boolean;
};

const Product = ({
  product,
  dispatch,
  REDUCER_ACTIONS,
}: PropsType): ReactElement => {
  const [isAdded, setIsAdded] = useState(false); 
  const img: string = new URL(`../images/${product.sku}.jpg`, import.meta.url)
    .href;

  const onAddToCart = () => {
    dispatch({ type: REDUCER_ACTIONS.ADD, payload: { ...product, qty: 1 } });
    setIsAdded(true); 
    setTimeout(() => setIsAdded(false), 2000); 
  };

  const content = (
    <article className={classes.product}>
      <h3>{product.name}</h3>
      <div className={classes.img_container}>
        <img src={img} alt={product.name} className={classes.product_img}></img>
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
      >
        {isAdded ? "Added to Cart" : "Add to Cart"}
      </button>
    </article>
  );

  return content;
};

function areProductsEqual(
  { product: prevProduct, inCart: prevInCart }: PropsType,
  { product: nextProduct, inCart: nextInCart }: PropsType
) {
  return Object.keys(prevProduct).every((key) => {
    return (
      prevProduct[key as keyof ProductType] ===
        nextProduct[key as keyof ProductType] && prevInCart === nextInCart
    );
  });
}

const MemoizedProduct = memo<typeof Product>(Product, areProductsEqual);

export default MemoizedProduct;
