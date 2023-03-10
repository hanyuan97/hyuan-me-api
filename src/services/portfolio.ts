import Portfolio from '../models/portfolio';

class PortfolioService {
  async getAll() {
    const portfolios = await Portfolio.find();
    return portfolios;
  }

  async getById(id: string) {
    const portfolio = await Portfolio.findById(id);
    return portfolio;
  }

  async create(data: any) {
    const portfolio = await Portfolio.create(data);
    return portfolio;
  }

  async update(id: string, data: any) {
    const portfolio = await Portfolio.findByIdAndUpdate(id, data, { new: true });
    return portfolio;
  }

  async delete(id: string) {
    const portfolio = await Portfolio.findByIdAndDelete(id);
    return portfolio;
  }
}

export default PortfolioService;