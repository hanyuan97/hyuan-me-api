import { Request, Response } from 'express';
import PortfolioService from '../../services/portfolio';

const portfolioService = new PortfolioService();

class PortfolioAdminController {
  async getAll(req: Request, res: Response) {
    const portfolios = await portfolioService.getAll();
    res.send(portfolios);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const portfolio = await portfolioService.getById(id);
    res.send(portfolio);
  }
  async create(req: Request, res: Response) {
    const { name, description, images, date } = req.body;
    const portfolio = await portfolioService.create({ name, description, images, date });
    res.send(portfolio);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description, images, date } = req.body;
    const portfolio = await portfolioService.update(id, { name, description, images, date });
    res.send(portfolio);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const portfolio = await portfolioService.delete(id);
    res.send(portfolio);
  }
}

export default new PortfolioAdminController();