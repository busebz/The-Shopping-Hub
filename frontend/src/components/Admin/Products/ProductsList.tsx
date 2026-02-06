import { Product } from "../../../types/product";
import classes from "./ProductsList.module.css";

type Props = {
  products: Product[];
  onAdd: () => void;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
};

const ProductsTable = ({ products, onAdd, onEdit, onDelete }: Props) => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <h2>Products</h2>
        <button className={classes.addBtn} onClick={onAdd}>
          Add Product
        </button>
      </div>

      <table className={classes.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th className={classes.actionsCol}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={3} className={classes.empty}>
                No products found
              </td>
            </tr>
          ) : (
            products.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.price} ₺</td>
                <td>
                  <div className={classes.actions}>
                    <button
                      className={classes.editBtn}
                      onClick={() => onEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className={classes.deleteBtn}
                      onClick={() => onDelete(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
