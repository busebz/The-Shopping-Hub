import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
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
  category?: string;
};

const getProductCategory = (product: ProductType) => {
  if (product.category) return product.category;

  const name = product.name.toLocaleLowerCase();

  if (/headphone|speaker|audio/.test(name)) return "Audio";
  if (/smartphone|phone|mobile/.test(name)) return "Mobiles";
  if (/watch|wearable/.test(name)) return "Wearables";
  if (/smart home|smart bulb|home hub/.test(name)) return "Smart Home";
  if (/laptop|notebook/.test(name)) return "Laptops";

  return "Accessories";
};

const ProductList = () => {
  const { cart, addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cartItems = useMemo(() => cart.map((i) => i.sku), [cart]);
  const searchTerm = searchParams.get("search")?.trim().toLocaleLowerCase() ?? "";
  const category = searchParams.get("category");
  const filteredProducts = products.filter((product) =>
    product.name.toLocaleLowerCase().includes(searchTerm) &&
    (!category || getProductCategory(product) === category)
  );

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
    <section id="products" className={classes.productsSection}>
      <div className={classes.header}>

        <h2>Featured Products</h2>

        <button>
          View All Products →
        </button>
      </div>
      <div className={classes.mainProducts}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))
          : filteredProducts.length > 0
            ? filteredProducts.map((p) => (
              <Product
                key={p.id}
                product={p}
                inCart={cartItems.includes(p.sku)}
                addToCart={addToCart}
              />
            ))
            : <p>No products found in this category.</p>}
    </div>
  </section >
  );
};

export default ProductList;
