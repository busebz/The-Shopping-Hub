import { useEffect, useState } from "react";
import classes from "./ProductEditor.module.css";

type Props = {
  initialData?: any;
  onCancel: () => void;
  onSave: (p: any) => void;
};

const ProductForm = ({ initialData, onCancel, onSave }: Props) => {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Accessories");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setSku(initialData.sku || "");
      setName(initialData.name);
      setPrice(initialData.price?.toString() || "");
      setCategory(initialData.category || "Accessories");
      setPreview(initialData.image);
      setImage(null);
    } else {
      setSku("");
      setName("");
      setPrice("");
      setCategory("Accessories");
      setImage(null);
      setPreview(null);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      id: initialData?.id,
      sku,
      name,
      price,
      category,
      image,
    });
  };

  return (
    <div className={classes.overlay} onClick={onCancel}>
      <form
        className={classes.form}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h3>{initialData ? "Edit Product" : "Add Product"}</h3>

        <input
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />

        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Audio">Audio</option>
          <option value="Mobiles">Mobiles</option>
          <option value="Accessories">Accessories</option>
          <option value="Wearables">Wearables</option>
          <option value="Smart Home">Smart Home</option>
          <option value="Laptops">Laptops</option>
        </select>

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setImage(file);

            if (file) {
              setPreview(URL.createObjectURL(file));
            }
          }}
        />

        {preview && <img src={preview} width={100} />}

        <div className={classes.actions}>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>

          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
