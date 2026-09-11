import { useMemo, useState } from "react";

import {
  FaMagnifyingGlass,
  FaPlus,
  FaPen,
  FaTrashCan,
} from "react-icons/fa6";

import { Product } from "../../../types/product";

import classes from "./ProductsList.module.css";

type Props = {
  products: Product[];
  onAdd: () => void;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
};

const ProductsTable = ({
  products,
  onAdd,
  onEdit,
  onDelete,
}: Props) => {
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return products;
    }

    return products.filter((product) =>
      product.name.toLowerCase().includes(value)
    );
  }, [products, search]);

  return (
    <div className={classes.page}>
      <div className={classes.pageHeader}>
        <div>
          <span className={classes.eyebrow}>
            PRODUCT MANAGEMENT
          </span>

          <h1>Products</h1>

          <p>
            Manage and organize your store products.
          </p>
        </div>

        <button
          type="button"
          className={classes.addBtn}
          onClick={onAdd}
        >
          <FaPlus />

          <span>Add Product</span>
        </button>
      </div>

      <div className={classes.wrapper}>
        <div className={classes.header}>
          <div className={classes.titleArea}>
            <h2>All Products</h2>

            <span className={classes.productCount}>
              {products.length}{" "}
              {products.length === 1
                ? "product"
                : "products"}
            </span>
          </div>

          <div className={classes.searchBox}>
            <FaMagnifyingGlass />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search products..."
            />
          </div>
        </div>

        <div className={classes.tableWrapper}>
          <table className={classes.table}>
            <thead>
              <tr>
                <th className={classes.numberColumn}>
                  #
                </th>

                <th>Product</th>

                <th>Price</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className={classes.empty}
                  >
                    {search
                      ? "No products match your search."
                      : "No products found."}
                  </td>
                </tr>
              ) : (
                filteredProducts.map(
                  (product, index) => (
                    <tr key={product.id}>
                      <td
                        className={
                          classes.numberColumn
                        }
                      >
                        {index + 1}
                      </td>

                      <td
                        className={
                          classes.productName
                        }
                      >
                        {product.name}
                      </td>

                      <td
                        className={
                          classes.price
                        }
                      >
                        ₺
                        {Number(
                          product.price
                        ).toFixed(2)}
                      </td>

                      <td>
                        <div
                          className={
                            classes.actions
                          }
                        >
                          <button
                            type="button"
                            className={
                              classes.editBtn
                            }
                            onClick={() =>
                              onEdit(product)
                            }
                          >
                            <FaPen />

                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            className={
                              classes.deleteBtn
                            }
                            onClick={() =>
                              onDelete(
                                product.id
                              )
                            }
                          >
                            <FaTrashCan />

                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        <div className={classes.footer}>
          <span>
            Showing {filteredProducts.length} of{" "}
            {products.length} products
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductsTable;