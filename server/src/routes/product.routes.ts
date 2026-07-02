import { Router } from 'express';
import { productController, productSchema } from '../controllers/product.controller';
import { stockMovementController } from '../controllers/stockMovement.controller';
import { validateBody } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(authenticate);
router.get('/', asyncHandler(productController.list));
router.get('/:id', asyncHandler(productController.getById));
router.get('/:id/movements', asyncHandler(stockMovementController.listByProduct));
router.post('/', validateBody(productSchema), asyncHandler(productController.create));
router.put('/:id', validateBody(productSchema), asyncHandler(productController.update));
router.delete('/:id', asyncHandler(productController.remove));
export default router;
