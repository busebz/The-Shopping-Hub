import { Router, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import Authenticate from "../middleware/Authenticate";
import { AuthRequest } from "../types";

const router = Router();

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getUserById = async (userId?: string) => {
  if (!userId) return null;
  return await User.findById(userId);
};

// Update user email & username
router.put("/update-user", Authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { email } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    if (!validateEmail(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    const user = await getUserById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.email = email;
    user.username = email.split("@")[0];
    await user.save();

    res.status(200).json({
      message: "Email and username updated",
      user: { email: user.email, username: user.username }
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Change user password
router.post("/change-password", Authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!oldPassword || !newPassword) {
      res.status(400).json({ message: "Old and new passwords required" });
      return;
    }

    const user = await getUserById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Old password is incorrect" });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
