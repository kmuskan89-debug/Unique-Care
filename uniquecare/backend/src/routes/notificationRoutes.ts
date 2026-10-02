import express, { Response, NextFunction } from 'express';
import { protect, authorize, AuthRequest } from '../middleware/authMiddleware';
import Subscription from '../models/Subscription';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

const router = express.Router();

router.use(protect);

router.post('/subscribe', authorize('technician', 'admin'), catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { endpoint, keys } = req.body;
  if (!endpoint || !keys) {
    return next(new AppError('Invalid subscription payload', 400));
  }
  
  await Subscription.findOneAndUpdate(
    { endpoint },
    { endpoint, keys, userId: req.user?._id },
    { upsert: true, new: true }
  );

  res.status(200).json({ status: 'success', message: 'Subscribed successfully' });
}));

export default router;
