import { Router } from 'express';
import authRoutes from './auth.routes';
import categoryRoutes from './category.routes';
import productRoutes from './product.routes';
import saleRoutes from './sale.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/sales', saleRoutes);
router.use('/dashboard', dashboardRoutes);
export default router;
