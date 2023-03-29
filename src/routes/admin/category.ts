import express from 'express';
import categoryController, { CategoryController } from '../../controllers/admin/category';

const router = express.Router();

router.get('/', (req, res) => categoryController.getAll(req, res));
router.get('/:id', (req, res) => categoryController.getById(req, res));
router.post('/', (req, res) => categoryController.create(req, res));
router.put('/:id', (req, res) => categoryController.update(req, res));
router.delete('/', (req, res) => categoryController.deleteAll(req, res));
router.delete('/:id', (req, res) => categoryController.delete(req, res));

export default router;