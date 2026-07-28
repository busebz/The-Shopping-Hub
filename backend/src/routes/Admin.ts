import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary";
import multer from "multer";
import { Readable } from "stream"

import User from "../models/User";
import Product from "../models/Product";
import Order from "../models/Order"

import Authenticate from "../middleware/Authenticate"
import Authorize from "../middleware/Authorize";

import { MulterRequest } from "../types";

const upload = multer({
  storage: multer.memoryStorage(),
});

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

router.get(
  "/products",
  Authenticate,
  Authorize("ADMIN"),
  async (_req: Request, res: Response) => {
    try {
      const products = await Product.find();

      res.json(
        products.map(p => ({
          id: p._id.toString(),
          sku: p.sku,
          name: p.name,
          price: p.price,
          image: p.image,
        }))
      );
    } catch (err) {
      res.status(500).json({ message: "Products fetch error" });
    }
  }
);

router.post(
  "/products",
  Authenticate,
  Authorize("ADMIN"),
  upload.single("image"),
  async (req: MulterRequest, res) => {
    try {
      const file = req.file;

      if (!file) {
        res.status(400).json({ message: "Image required" });
        return;
      }

      const { sku, name, price } = req.body;

      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result);
          }
        );

        Readable.from(file.buffer).pipe(stream);
      });

      const product = await Product.create({
        sku,
        name,
        price,
        image: result.secure_url,
      });

      res.json({
        id: product._id.toString(),
        sku: product.sku,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      return;

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Product create error" });
      return;
    }
  }
);

router.put(
  "/products/:id",
  Authenticate,
  Authorize("ADMIN"),
  upload.single("image"),
  async (req: MulterRequest, res) => {
    try {

      const file = req.file;
      const { sku, name, price } = req.body;

      let updateData: any = {
        sku,
        name,
        price: Number(price),
      };

      if (file) {
        const result = await new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (error || !result) return reject(error);
              resolve(result);
            }
          );

          Readable.from(file.buffer).pipe(stream);
        });

        updateData.image = result.secure_url;
      }

      const updated = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      res.json({
        id: updated?._id.toString(),
        sku: updated?.sku,
        name: updated?.name,
        price: updated?.price,
        image: updated?.image,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Product update error" });
    }
  }
);

router.delete("/products/:id", Authenticate, Authorize("ADMIN"), async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Product delete error" });
  }
});

export default router;
