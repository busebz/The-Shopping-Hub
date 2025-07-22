import { Router, Request, Response, NextFunction } from 'express';
import User from '../models/User';
import authenticateMiddleware from '../middleware/Authenticate';

const router = Router();

// Sipariş ekleme
router.post('/orders', authenticateMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: 'Sipariş ürünleri boş olamaz' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    user.orders = user.orders || [];
    user.orders.push({ date: new Date(), items });

    await user.save();

    res.status(200).json({ message: 'Sipariş başarıyla kaydedildi' });
    return;
  } catch (error) {
    console.error('Sipariş kaydetme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
    return;
  }
});

// Siparişleri listeleme
router.get('/orders', authenticateMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      return;
    }

    res.json(user.orders || []);
    return;
  } catch (error) {
    console.error('Sipariş getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
    return;
  }
});

export default router;
