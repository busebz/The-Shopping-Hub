import { Router, Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';

const router = Router();

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined!');
const JWT_SECRET = process.env.JWT_SECRET;

// Helper to sign JWT
const signToken = (id: string, role: string) => jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '2h' });

// Helper to send JSON responses
const sendResponse = (res: Response, status: number, success: boolean, message: string, data?: any) => {
  res.status(status).json({ success, message, data });
  return;
};

// Validate registration data
const validateRegister = (username: string, email: string, password: string) => {
  if (!username || !email || !password) return 'Username, email, and password are required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  return null;
};

// Format user data
const formatUser = (user: IUser) => ({
  id: user._id.toString(),
  username: user.username,
  email: user.email,
});

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const validationError = validateRegister(username, email, password);
    if (validationError) return sendResponse(res, 400, false, validationError);

    const existingUser = await User.findOne({ email }) as IUser | null;
    if (existingUser) return sendResponse(res, 409, false, 'Email already registered');

    const user = new User({ username, email, password });
    await user.save();

    return sendResponse(res, 201, true, 'User registered successfully', {
      user: formatUser(user),
      token: signToken(user._id.toString(), user.role),
    });
  } catch (err) {
    console.error('Register error:', err);
    return sendResponse(res, 500, false, 'Server error');
  }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, false, "Email and password required");
    }

    const user = (await User.findOne({ email })) as IUser | null;
    if (!user) {
      return sendResponse(res, 401, false, "Invalid credentials");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendResponse(res, 401, false, "Invalid credentials");
    }

    return sendResponse(res, 200, true, "Login successful", {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      token: signToken(user._id.toString(), user.role),
    });
  } catch (error) {
    return sendResponse(res, 500, false, "Server error");
  }
});

export default router;
