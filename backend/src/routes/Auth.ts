import express, { RequestHandler } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const signToken = (id: string) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '1d' });

const register: RequestHandler = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ message: 'Username, email and password required' });
      return;
    }

    const existingUser = await User.findOne({ email }) as IUser | null;
    if (existingUser) {
      res.status(409).json({ message: 'Email already registered' });
      return;
    }

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({
      user: { id: user._id.toString(), username: user.username, email: user.email },
      token: signToken(user._id.toString()),
    });
  } catch (err) {
    next(err);
  }
};

const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password required' });
      return;
    }

    const user = await User.findOne({ email }) as IUser | null;
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    res.json({
      user: { id: user!._id.toString(), username: user!.username, email: user!.email },
      token: signToken(user._id.toString()),
    });
  } catch (err) {
    next(err);
  }
};

router.post('/register', register);
router.post('/login', login);

export default router;
