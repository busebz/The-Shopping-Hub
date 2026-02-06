import { useEffect, useState } from "react";
import ProductsTable from "./ProductsList";
import ProductForm from "./ProductEditor";
import { Product } from "../../../types/product";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setProducts([
      {
        id: "1",
        name: "MacBook Pro",
        price: 85000,
        image: "",
      },
    ]);
  }, []);

  const saveProduct = (product: Product) => {
    setProducts(prev =>
      prev.some(p => p.id === product.id)
        ? prev.map(p => (p.id === product.id ? product : p))
        : [...prev, product]
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <>
      <h1>Products</h1>

      <ProductsTable
        products={products}
        onAdd={() => {
          setEditingProduct(null);
          setShowForm(true);
        }}
        onEdit={p => {
          setEditingProduct(p);
          setShowForm(true);
        }}
        onDelete={deleteProduct}
      />

      {showForm && (
        <ProductForm
          initialData={editingProduct ?? undefined}
          onCancel={() => setShowForm(false)}
          onSave={p => {
            saveProduct(p);
            setShowForm(false);
          }}
        />
      )}
    </>
  );
};

export default Products;
