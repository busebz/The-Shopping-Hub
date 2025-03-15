import { createContext, ReactElement, useState, useEffect } from "react";

export type ProductType = {
  sku: string;
  name: string;
  price: number;
};

export type UseProductContextType = { products: ProductType[] };

const initContextState: UseProductContextType = { products: [] };

const ProductsContext = createContext<UseProductContextType>(initContextState);

type ChildrenType = { children?: ReactElement | ReactElement[] };

export const ProductsProvider = ({ children }: ChildrenType): ReactElement => {
  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      try {
        const response = await fetch("https://the-shopping-hub-backend.onrender.com/api/products");
        
        if (response.ok) {
          const data = await response.json();
          setProducts(data);  
        } else {
          console.error("Failed to fetch products");
        }
      } catch (err) {
        if (err instanceof Error) {
          console.log(err.message);
        }
      }
    };

    fetchProducts();
  }, []); 

  return (
    <ProductsContext.Provider value={{ products }}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsContext;
