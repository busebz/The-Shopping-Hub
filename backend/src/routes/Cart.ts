import { Router, Response, NextFunction } from "express";
import User from "../models/User";
import Authenticate from "../middleware/Authenticate";
import { AuthRequest } from "../types";

const router = Router();

router.post("/", Authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      res.status(400).json({ message: "Items missing or invalid" });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.cart = items;
    await user.save();
    res.status(200).json({ message: "Cart updated" });
  } catch (err) {
    console.error("Cart update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", Authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user.cart || []);
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:sku", Authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { sku } = req.params;
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.cart = user.cart.filter((item) => item.sku !== sku);
    await user.save();
    res.status(200).json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("Remove item error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:sku", Authenticate, async (req: AuthRequest, res: Response)=> {
  try {
    const { sku } = req.params;
    const { quantity } = req.body;
    if (quantity === undefined || quantity < 1) {
      res.status(400).json({ message: "Invalid quantity" });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const itemIndex = user.cart.findIndex((item) => item.sku === sku);
    if (itemIndex === -1) {
      res.status(404).json({ message: "Item not found in cart" });
      return;
    }

    user.cart[itemIndex].quantity = quantity;
    await user.save();
    res.status(200).json({ message: "Quantity updated" });
  } catch (err) {
    console.error("Update quantity error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
