import { Router } from 'express';
import { authController, loginSchema } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
router.post('/login', validateBody(loginSchema), asyncHandler(authController.login));
router.get('/me', authenticate, asyncHandler(authController.me));
export default router;
