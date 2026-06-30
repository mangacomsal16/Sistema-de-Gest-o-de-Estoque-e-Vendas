import { Router } from 'express';
import { categoryController, categorySchema } from '../controllers/category.controller';
import { validateBody } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.use(authenticate);
router.get('/', asyncHandler(categoryController.list));
router.post('/', validateBody(categorySchema), asyncHandler(categoryController.create));
router.put('/:id', validateBody(categorySchema), asyncHandler(categoryController.update));
router.delete('/:id', asyncHandler(categoryController.remove));
export default router;
