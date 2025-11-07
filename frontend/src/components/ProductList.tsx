import { useEffect, useState, useMemo } from "react";
import classes from "./ProductList.module.css";
import useCart from "../hooks/useCart";
import Product from "./Product";

const API_URL = import.meta.env.VITE_API_URL || "https://the-shopping-hub-backend-production.up.railway.app";

type ProductType = {
  sku: string;
  name: string;
  price: number;
};

const ProductList = () => {
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cartItems = useMemo(() => cart.map(item => item.sku), [cart]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/products`,
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className={classes.error}>{error}</p>;
  if (!products.length) return <p>No products found</p>;

  return (
    <div className={classes.mainProducts}>
      {products.map((product) => (
        <Product
          key={product.sku}
          product={product}
          inCart={cartItems.includes(product.sku)}
          addToCart={addToCart}
        />
      ))}
    </div>
  );
};

export default ProductList;
