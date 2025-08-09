import { Router, Request, Response, NextFunction } from "express";
import User from "../models/User";
import authenticateMiddleware from "../middleware/Authenticate";

const router = Router();

interface AuthRequest extends Request {
  userId?: string;
}

router.post(
  "/orders",
  authenticateMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      const user = await User.findById(userId);

      if (!user) {
        res.status(404).json({ message: "Kullanıcı bulunamadı" });
        return;
      }

      if (!user.cart || user.cart.length === 0) {
        res.status(400).json({ message: "Sepet boş, sipariş verilemez" });
        return;
      }

      user.orders = user.orders || [];
      user.orders.push({ date: new Date(), items: user.cart });

      user.cart = [];

      await user.save();

      res.status(200).json({ message: "Sipariş başarıyla kaydedildi" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  }
);

router.get(
  "/orders",
  authenticateMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId;
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "Kullanıcı bulunamadı" });
        return;
      }

      res.json(user.orders || []);
      return;
    } catch (error) {
      console.error("Sipariş getirme hatası:", error);
      res.status(500).json({ message: "Sunucu hatası" });
      return;
    }
  }
);

router.post(
  "/cart",
  authenticateMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      const { items } = req.body;

      if (!items || !Array.isArray(items)) {
        res.status(400).json({ message: "Items missing or invalid" });
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "Kullanıcı bulunamadı" });
        return;
      }

      user.cart = items;
      await user.save();

      res.status(200).json({ message: "Sepet güncellendi" });
    } catch (error) {
      console.error("Sepet güncelleme hatası:", error);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  }
);


router.get(
  "/cart",
  authenticateMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req as any).userId;

    try {
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "Kullanıcı bulunamadı" });
        return;
      }

      res.status(200).json(user.cart || []);
    } catch (error) {
      res.status(500).json({ message: "Sunucu hatası" });
    }
  }
);

router.delete(
  "/cart/:sku",
  authenticateMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId;
      const { sku } = req.params;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      user.cart = user.cart.filter((item) => item.sku !== sku);
      await user.save();

      res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
      console.error("Error removing item:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.put(
  "/cart/:sku",
  authenticateMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId;
      const { sku } = req.params;
      const { quantity } = req.body;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      if (quantity === undefined || quantity < 1) {
        res.status(400).json({ message: "Invalid quantity" });
        return;
      }

      const user = await User.findById(userId);
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
    } catch (error) {
      console.error("Error updating quantity:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);


export default router;
