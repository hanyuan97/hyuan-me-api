import express from 'express';
import portfolioRoutes from './portfolio';

const router = express.Router();

router.use('/portfolio', portfolioRoutes);

export default router;