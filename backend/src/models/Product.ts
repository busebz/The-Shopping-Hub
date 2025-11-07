import { Schema, model } from 'mongoose';

export interface ProductType {
  sku: string;
  name: string;
  price: number;
};

const ProductSchema = new Schema<ProductType>({
  sku: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});


const ProductModel = model('Product', ProductSchema);

export default ProductModel;
