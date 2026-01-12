import mongoose, { Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { CartItem, CartItemSchema } from './CartItem';
import { Order, OrderSchema } from './Order';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
  cart: CartItem[];
  orders: Order[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
  cart: { type: [CartItemSchema], default: [] },
  orders: { type: [OrderSchema], default: [] },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

UserSchema.methods.comparePassword = async function (this: IUser, candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.index({ email: 1 });

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
