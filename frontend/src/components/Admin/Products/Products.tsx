import { useEffect, useState } from "react";
import ProductsTable from "./ProductsList";
import ProductForm from "./ProductEditor";

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // ================= GET =================
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/products", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      });
  }, []);

  // ================= DELETE =================
  const deleteProduct = async (id: string) => {
    await fetch(`http://localhost:5000/api/admin/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ================= SAVE (ADD + EDIT) =================
  const saveProduct = async (product: any) => {
  const formData = new FormData();

  formData.append("sku", product.sku);
  formData.append("name", product.name);
  formData.append("price", product.price);

  if (product.image instanceof File) {
    formData.append("image", product.image);
  }

  const isEdit = Boolean(product.id);

  const url = isEdit
    ? `http://localhost:5000/api/admin/products/${product.id}`
    : "http://localhost:5000/api/admin/products";

  const method = isEdit ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
    body: formData,
  });

  const data = await res.json();

  setProducts((prev) =>
    isEdit
      ? prev.map((p) => (p.id === data.id ? data : p))
      : [...prev, data]
  );
};

  return (
    <>
      <h1>Products</h1>

      <ProductsTable
        products={products}
        onDelete={deleteProduct}
        onAdd={() => {
          setEditingProduct(null);
          setShowModal(true);
        }}
        onEdit={(p) => {
          setEditingProduct(p);
          setShowModal(true);
        }}
      />

      {showModal && (
        <ProductForm
          initialData={editingProduct}
          onCancel={() => setShowModal(false)}
          onSave={async (p) => {
            await saveProduct(p);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
};

export default Products;