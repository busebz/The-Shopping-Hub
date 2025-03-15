import { useContext } from "react";
import ProductsContext from "../context/ProductsProvider";
import { UseProductContextType } from "../context/ProductsProvider";

const useProducts = (): UseProductContextType => {
  return useContext(ProductsContext);
};

export default useProducts;
