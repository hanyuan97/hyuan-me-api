import express from 'express';
import portfolioController, { PortfolioController } from '../../controllers/admin/portfolio';

const router = express.Router();

router.get('/', (req, res) => portfolioController.getAll(req, res));
router.get('/:id', (req, res) => portfolioController.getById(req, res));
router.post('/', (req, res) => portfolioController.create(req, res));
router.put('/:id', (req, res) => portfolioController.update(req, res));
router.delete('/', (req, res) => portfolioController.deleteAll(req, res));
router.delete('/:id', (req, res) => portfolioController.delete(req, res));

export default router;