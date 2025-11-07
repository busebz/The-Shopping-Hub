import { Router, Response } from "express";
import User from "../models/User";
import authenticateMiddleware from "../middleware/Authenticate";
import { AuthRequest } from "../types";

const router = Router();

router.post("/", authenticateMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (!user.cart?.length) {
      res.status(400).json({ message: "Cart is empty" });
      return;
    }

    user.orders = user.orders || [];
    user.orders.push({ date: new Date(), items: user.cart });
    user.cart = [];
    await user.save();

    res.status(200).json({ message: "Order saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", authenticateMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user.orders || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
