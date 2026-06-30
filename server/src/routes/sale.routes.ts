import { Router } from 'express';
import { saleController, saleSchema } from '../controllers/sale.controller';
import { validateBody } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(authenticate);
router.get('/', asyncHandler(saleController.list));
router.post('/', validateBody(saleSchema), asyncHandler(saleController.create));
export default router;
