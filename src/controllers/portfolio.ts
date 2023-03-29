import { PortfolioService } from '../services/portfolio';
import { CrudController } from './crud';
import Portfolio, { PortfolioDocument } from '../models/portfolio';

export class PortfolioController extends CrudController<PortfolioDocument> {
  constructor(portfolioService: PortfolioService<PortfolioDocument>) {
    super(portfolioService);
  }
}

const portfolioService = new PortfolioService<PortfolioDocument>(Portfolio);
const portfolioController = new PortfolioController(portfolioService);

export default portfolioController;