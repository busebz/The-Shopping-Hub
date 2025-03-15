import mongoose from 'mongoose';

export type ProductType = {
  sku: string;
  name: string;
  price: number;
};


const productSchema = new mongoose.Schema<ProductType>({
  sku: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});


const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;
