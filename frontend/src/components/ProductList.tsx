import classes from "./ProductList.module.css";
import useCart from "../hooks/useCart";
import useProducts from "../hooks/useProducts";
import Product from "./Product";

const ProductList = () => {
  const { cart, addToCart } = useCart();
  const { products } = useProducts();

  if (!products?.length) {
    return <p>No products found</p>;
  }

  return (
    <div className={classes.mainProducts}>
      {products.map((product) => {
        const inCart = cart.some((item) => item.sku === product.sku);

        return (
          <Product
            key={product.sku}
            product={product}
            inCart={inCart}
            addToCart={addToCart}
          />
        );
      })}
    </div>
  );
};

export default ProductList;
