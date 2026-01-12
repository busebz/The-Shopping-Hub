import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../models/User";
import Product from "../models/Product";

import Authenticate from "../middleware/Authenticate"
import Authorize from "../middleware/Authorize";

const router = Router();

/* ---------------- DASHBOARD ---------------- */
router.get("/dashboard", Authenticate, Authorize("ADMIN"), async (_req, res) => {
  /* const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();

  const totalSalesAgg = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);

  res.json({
    totalProducts,
    totalOrders,
    totalSales: totalSalesAgg[0]?.total || 0,
  }); */
  res.json({ message: "Welcome Admin" });
});

/* ---------------- PRODUCTS ---------------- */
router.delete("/products/:id", Authenticate, Authorize("ADMIN"), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

export default router;
