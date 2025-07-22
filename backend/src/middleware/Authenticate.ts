import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

interface JwtPayload {
  id: string;
}

const authenticateMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Token eksik' });
    return;  // burada sadece return; dönüyoruz, response döndürmüyoruz
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Token eksik' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token geçersiz' });
    return;
  }
};

export default authenticateMiddleware;
