import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';

interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderItem extends CartItem {}

interface Order {
  date: Date;
  items: OrderItem[];
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  cart: CartItem[];
  orders: Order[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const CartItemSchema = new Schema<CartItem>({
  sku: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new Schema<Order>({
  date: { type: Date, required: true },
  items: [CartItemSchema],
});

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: { type: [CartItemSchema], default: [] },
  orders: { type: [OrderSchema], default: [] },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as any);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
