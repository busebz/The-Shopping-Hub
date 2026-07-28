import { useEffect, useState, useMemo } from "react";
import classes from "./ProductList.module.css";
import useCart from "../hooks/useCart";
import Product from "./Product";
import ProductSkeleton from "./ProductSkeleton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type ProductType = {
  id: string;
  sku: string;
  name: string;
  price: number;
  image: string;
};

const ProductList = () => {
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cartItems = useMemo(() => cart.map((i) => i.sku), [cart]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`, {
          signal: controller.signal,
        });

        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div className={classes.mainProducts}>
      {loading
        ? Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))
        : products.map((p) => (
            <Product
              key={p.id}
              product={p}
              inCart={cartItems.includes(p.sku)}
              addToCart={addToCart}
            />
          ))}
    </div>
  );
};

export default ProductList;