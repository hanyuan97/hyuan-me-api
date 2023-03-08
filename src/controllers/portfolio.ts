import { Request, Response } from 'express';
import PortfolioService from '../services/portfolio';

const portfolioService = new PortfolioService();

class PortfolioController {
  async getAll(req: Request, res: Response) {
    const portfolios = await portfolioService.getAll();
    res.send(portfolios);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const portfolio = await portfolioService.getById(id);
    res.send(portfolio);
  }
}

export default new PortfolioController();