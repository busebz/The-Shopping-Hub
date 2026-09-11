import { Router, Response } from "express";
import User from "../models/User";
import Authenticate from "../middleware/Authenticate";
import { AuthRequest } from "../types";

const router = Router();

/**
 * UPDATE WHOLE CART
 */
router.post("/", Authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      res.status(400).json({
        message: "Items missing or invalid",
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          cart: items,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      message: "Cart updated",
      cart: user.cart,
    });
  } catch (err) {
    console.error("Cart update error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

/**
 * GET CART
 */
router.get("/", Authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json(user.cart || []);
  } catch (err) {
    console.error("Get cart error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

/**
 * REMOVE ITEM FROM CART
 */
router.delete(
  "/:sku",
  Authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { sku } = req.params;

      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          $pull: {
            cart: {
              sku,
            },
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!user) {
        res.status(404).json({
          message: "User not found",
        });
        return;
      }

      res.status(200).json({
        message: "Item removed from cart",
        cart: user.cart,
      });
    } catch (err) {
      console.error("Remove item error:", err);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

/**
 * UPDATE ITEM QUANTITY
 */
router.put(
  "/:sku",
  Authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { sku } = req.params;
      const { quantity } = req.body;

      const parsedQuantity = Number(quantity);

      if (
        quantity === undefined ||
        !Number.isFinite(parsedQuantity) ||
        parsedQuantity < 1
      ) {
        res.status(400).json({
          message: "Invalid quantity",
        });
        return;
      }

      const user = await User.findOneAndUpdate(
        {
          _id: req.userId,
          "cart.sku": sku,
        },
        {
          $set: {
            "cart.$.quantity": parsedQuantity,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!user) {
        res.status(404).json({
          message: "User or item not found in cart",
        });
        return;
      }

      res.status(200).json({
        message: "Quantity updated",
        cart: user.cart,
      });
    } catch (err) {
      console.error("Update quantity error:", err);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

export default router;