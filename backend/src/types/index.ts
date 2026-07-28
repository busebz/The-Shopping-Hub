import { Request } from "express";

export interface AuthRequest extends Request {
  userId?: string;
  role?: string;
}

export interface MulterRequest extends Request {
  file?: Express.Multer.File;
}