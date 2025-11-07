import { Schema, model } from 'mongoose';
import { CartItemSchema, CartItem } from './CartItem';

export interface Order {
  date: Date;
  items: CartItem[];
}

export const OrderSchema = new Schema<Order>({
  date: { type: Date, required: true },
  items: { type: [CartItemSchema], default: [] },
});

const OrderModel = model('Order', OrderSchema);

export default OrderModel;