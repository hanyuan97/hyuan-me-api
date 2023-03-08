import express from 'express';
import portfolioController from '../../controllers/admin/portfolio';

const router = express.Router();

router.get('/', portfolioController.getAll);
router.get('/:id', portfolioController.getById);
router.post('/', portfolioController.create);
router.put('/:id', portfolioController.update);
router.delete('/:id', portfolioController.delete);

export default router;