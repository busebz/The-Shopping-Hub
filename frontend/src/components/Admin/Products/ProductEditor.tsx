import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FaBoxOpen,
  FaXmark,
  FaImage,
  FaFloppyDisk,
} from "react-icons/fa6";

import classes from "./ProductEditor.module.css";

type Props = {
  initialData?: any;
  onCancel: () => void;
  onSave: (p: any) => void;
};

const ProductForm = ({
  initialData,
  onCancel,
  onSave,
}: Props) => {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [category, setCategory] =
    useState("Accessories");

  const [image, setImage] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<string | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialData) {
      setSku(initialData.sku || "");
      setName(initialData.name || "");

      setPrice(
        initialData.price?.toString() || ""
      );

      setCategory(
        initialData.category ||
          "Accessories"
      );

      setPreview(
        initialData.image || null
      );

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

  const handleSubmit = (
    e: React.FormEvent
  ) => {
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

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0] || null;

    setImage(file);

    if (file) {
      setPreview(
        URL.createObjectURL(file)
      );
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={classes.overlay}
      onClick={onCancel}
    >
      <form
        className={classes.form}
        onClick={(e) =>
          e.stopPropagation()
        }
        onSubmit={handleSubmit}
      >
        {/* HEADER */}

        <div className={classes.header}>
          <div
            className={
              classes.headerContent
            }
          >
            <div
              className={
                classes.headerIcon
              }
            >
              <FaBoxOpen />
            </div>

            <div>
              <h3>
                {initialData
                  ? "Edit Product"
                  : "Add Product"}
              </h3>

              <p>
                {initialData
                  ? "Update the product information below."
                  : "Enter the product information below."}
              </p>
            </div>
          </div>

          <button
            type="button"
            className={classes.closeBtn}
            onClick={onCancel}
            aria-label="Close"
          >
            <FaXmark />
          </button>
        </div>

        {/* CONTENT */}

        <div
          className={
            classes.formContent
          }
        >
          {/* SKU */}

          <div
            className={
              classes.formGroup
            }
          >
            <label htmlFor="sku">
              SKU
            </label>

            <input
              id="sku"
              type="text"
              placeholder="Enter SKU"
              value={sku}
              onChange={(e) =>
                setSku(e.target.value)
              }
              required
            />
          </div>

          {/* PRODUCT NAME */}

          <div
            className={
              classes.formGroup
            }
          >
            <label htmlFor="name">
              Product Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />
          </div>

          {/* CATEGORY */}

          <div
            className={
              classes.formGroup
            }
          >
            <label htmlFor="category">
              Category
            </label>

            <select
              id="category"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
            >
              <option value="Audio">
                Audio
              </option>

              <option value="Mobiles">
                Mobiles
              </option>

              <option value="Accessories">
                Accessories
              </option>

              <option value="Wearables">
                Wearables
              </option>

              <option value="Smart Home">
                Smart Home
              </option>

              <option value="Laptops">
                Laptops
              </option>
            </select>
          </div>

          {/* PRICE */}

          <div
            className={
              classes.formGroup
            }
          >
            <label htmlFor="price">
              Price (₺)
            </label>

            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              required
            />
          </div>

          {/* IMAGE */}

          <div
            className={
              classes.imageSection
            }
          >
            <label>
              Product Image
            </label>

            <div
              className={
                classes.imageRow
              }
            >
              <button
                type="button"
                className={
                  classes.uploadBox
                }
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                <div
                  className={
                    classes.uploadIcon
                  }
                >
                  <FaImage />
                </div>

                <div
                  className={
                    classes.uploadText
                  }
                >
                  <strong>
                    {image
                      ? image.name
                      : "Choose an image"}
                  </strong>

                  <span>
                    JPG, PNG or WebP
                    (Max 5MB)
                  </span>
                </div>
              </button>

              <input
                ref={fileInputRef}
                className={
                  classes.fileInput
                }
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={
                  handleImageChange
                }
              />

              {preview && (
                <div
                  className={
                    classes.previewWrapper
                  }
                >
                  <img
                    src={preview}
                    alt="Product preview"
                    className={
                      classes.preview
                    }
                  />

                  <button
                    type="button"
                    className={
                      classes.removeImage
                    }
                    onClick={
                      removeImage
                    }
                    aria-label="Remove image"
                  >
                    <FaXmark />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <div className={classes.actions}>
          <button
            type="button"
            className={
              classes.cancelBtn
            }
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={
              classes.saveBtn
            }
          >
            <FaFloppyDisk />

            <span>
              {initialData
                ? "Save Changes"
                : "Add Product"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;