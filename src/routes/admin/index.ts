import express from 'express';
import portfolioRoutes from './portfolio';
import categoryRoutes from './category';

const router = express.Router();

router.use('/portfolio', portfolioRoutes);
router.use('/category', categoryRoutes);

export default router;