import express from 'express';
import portfolioController from '../controllers/portfolio';

const router = express.Router();

router.get('/', (req, res) => portfolioController.getAll(req, res));
router.get('/:id', (req, res) => portfolioController.getById(req, res));

export default router;