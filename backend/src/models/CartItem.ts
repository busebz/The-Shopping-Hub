import { Schema, model } from 'mongoose';

export interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
}

export const CartItemSchema = new Schema<CartItem>({
  sku: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const CartItemModel = model('CartItem', CartItemSchema);

export default CartItemModel;
