import express from 'express';
import portfolioController, { PortfolioController } from '../../controllers/admin/portfolio';

const router = express.Router();

async function test(portfolioController: PortfolioController) {
  const res = await portfolioController.crudService.getAll();
  console.log(res);
}

test(portfolioController);

router.get('/', (req, res) => portfolioController.getAll(req, res));
router.get('/:id', portfolioController.getById);
router.post('/', portfolioController.create);
router.put('/:id', portfolioController.update);
router.delete('/:id', portfolioController.delete);

export default router;