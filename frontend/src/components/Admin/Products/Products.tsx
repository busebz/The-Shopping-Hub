import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductsTable from "./ProductsList";
import ProductForm from "./ProductEditor";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] =
    useState<string | null>(null);

  // ================= GET =================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const token =
          localStorage.getItem("adminToken");

        const res = await fetch(
          `${API_URL}/api/admin/products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(
            data.message ||
              "Failed to load products."
          );

          return;
        }

        setProducts(
          Array.isArray(data)
            ? data
            : []
        );
      } catch {
        setError(
          "Unable to connect to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ================= DELETE =================

  const deleteProduct = async (
    id: string
  ) => {
    try {
      const token =
        localStorage.getItem("adminToken");

      const res = await fetch(
        `${API_URL}/api/admin/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();

        setError(
          data.message ||
            "Failed to delete product."
        );

        return;
      }

      setProducts((prev) =>
        prev.filter(
          (product) =>
            product.id !== id
        )
      );
    } catch {
      setError(
        "Unable to delete product."
      );
    }
  };

  // ================= SAVE =================

  const saveProduct = async (
    product: any
  ) => {
    try {
      setError(null);

      const formData =
        new FormData();

      formData.append(
        "sku",
        product.sku
      );

      formData.append(
        "name",
        product.name
      );

      formData.append(
        "price",
        product.price
      );

      formData.append(
        "category",
        product.category
      );

      if (
        product.image instanceof File
      ) {
        formData.append(
          "image",
          product.image
        );
      }

      const isEdit =
        Boolean(product.id);

      const url = isEdit
        ? `${API_URL}/api/admin/products/${product.id}`
        : `${API_URL}/api/admin/products`;

      const method = isEdit
        ? "PUT"
        : "POST";

      const token =
        localStorage.getItem("adminToken");

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Failed to save product."
        );
      }

      setProducts((prev) =>
        isEdit
          ? prev.map((p) =>
              p.id === data.id
                ? data
                : p
            )
          : [...prev, data]
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to save product.";

      setError(message);

      throw err;
    }
  };

  // ================= ADD =================

  const handleAdd = () => {
    navigate("/admin/products/new");
  };

  // ================= EDIT =================

  const handleEdit = (
    product: any
  ) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  // ================= CLOSE =================

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  // ================= RENDER =================

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          padding: "40px",
          boxSizing: "border-box",
          color: "#747b87",
        }}
      >
        Loading products...
      </div>
    );
  }

  return (
    <>
      <ProductsTable
        products={products}
        onDelete={deleteProduct}
        onAdd={handleAdd}
        onEdit={handleEdit}
      />

      {error && (
        <div
          style={{
            position: "fixed",
            right: "24px",
            bottom: "24px",
            zIndex: 9999,
            maxWidth: "360px",
            padding: "14px 18px",
            border: "1px solid #ffd1d5",
            borderRadius: "10px",
            background: "#fff3f4",
            color: "#d5454e",
            boxShadow:
              "0 10px 30px rgba(0, 0, 0, 0.08)",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

      {showModal && (
        <ProductForm
          initialData={editingProduct}
          onCancel={handleCloseModal}
          onSave={async (product) => {
            await saveProduct(product);
            handleCloseModal();
          }}
        />
      )}
    </>
  );
};

export default Products;