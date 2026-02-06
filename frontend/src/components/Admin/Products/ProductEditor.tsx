import { useState } from "react";
import { Product } from "../../../types/product";
import classes from "./ProductEditor.module.css";

type Props = {
  initialData?: Product;
  onCancel: () => void;
  onSave: (p: Product) => void;
};

const ProductForm = ({ initialData, onCancel, onSave }: Props) => {
  const [name, setName] = useState(initialData?.name ?? "");
  const [price, setPrice] = useState(
    initialData?.price?.toString() ?? ""
  );
  const [image, setImage] = useState(initialData?.image ?? "");

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      id: initialData?.id ?? Date.now().toString(),
      name,
      price: Number(price),
      image,
    });
  };

  return (
    <div className={classes.overlay}>
      <form className={classes.form} onSubmit={submitHandler}>
        <h3>{initialData ? "Edit Product" : "Add Product"}</h3>

        <input
          placeholder="Product name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />

        <input
          placeholder="Image URL"
          value={image}
          onChange={e => setImage(e.target.value)}
        />

        <div className={classes.actions}>
          <button
            type="button"
            className={classes.cancelBtn}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className={classes.saveBtn}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
