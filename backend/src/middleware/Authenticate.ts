import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined!");
}

const JWT_SECRET = process.env.JWT_SECRET;

interface JwtPayload {
  id: string;
  role: string;
}

const authenticateMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token missing or invalid" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.userId = decoded.id;
    req.role = decoded.role;

    next();
  } catch {
    res.status(401).json({ message: "Token invalid" });
  }
};

export default authenticateMiddleware;
