import express from 'express';
import portfolioController from '../controllers/portfolio';

const router = express.Router();

router.get('/', portfolioController.getAll);
router.get('/:id', portfolioController.getById);

export default router;