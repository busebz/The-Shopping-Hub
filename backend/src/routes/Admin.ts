import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../models/User";
import Product from "../models/Product";
import Order from "../models/Order"

import Authenticate from "../middleware/Authenticate"
import Authorize from "../middleware/Authorize";

const router = Router();

router.get(
  "/dashboard",
  Authenticate,
  Authorize("ADMIN"),
  async (_req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalProducts = await Product.countDocuments();

      const users = await User.find().select("email orders");

      const allOrders = users.flatMap(user => {
        if (!Array.isArray(user.orders)) return [];

        return user.orders.map(order => {
          const items = Array.isArray(order.items) ? order.items : [];

          const total = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

          return {
            user: user.email,
            date: order.date,
            total,
          };
        });
      });

      const totalOrders = allOrders.length;

      const recentOrders = allOrders
        .filter(o => o.date instanceof Date)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5);

      res.json({
        totalUsers,
        totalProducts,
        totalOrders,
        recentOrders, 
      });
    } catch (err) {
      console.error("Dashboard error:", err);
      res.status(500).json({ message: "Dashboard data error" });
    }
  }
);


router.delete("/products/:id", Authenticate, Authorize("ADMIN"), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

export default router;
