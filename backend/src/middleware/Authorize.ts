import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";

export const Authorize =
  (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.role || !roles.includes(req.role)) {
      res.status(403).json({ message: "Access denied" });
      return;
    }
    next();
};

export default Authorize;