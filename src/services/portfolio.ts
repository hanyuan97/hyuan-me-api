import { Model, Document, Query } from 'mongoose';
import { CrudService } from './crud';
import {PortfolioData, PortfolioDocument} from '../models/portfolio'

export class PortfolioService<T extends Document> extends CrudService<T> {
  constructor(model: Model<T>) {
    super(model);
  }
  async getAll(
    page=1,
    limit=Number.MAX_SAFE_INTEGER,
    sortField?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<{ data: T[]; totalCount: number }> {
    let query: Query<T[], T> = this.model.find().populate('categories');
    const totalCount: number = await this.model.countDocuments();

    if (sortField) {
      const sortOrderVal = sortOrder === 'desc' ? -1 : 1;
      query = query.sort({ [sortField]: sortOrderVal });
    }
    
    const data = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return { data, totalCount };
  }
  async create(data: any): Promise<T> {
    if (data._id) delete data._id;
    if (!data.order) {
      const maxOrder:any = await this.model.findOne().sort('-order');
      const newOrder = maxOrder ? maxOrder.order + 1 : 0;
      data.order = newOrder
    }
    return this.model.create(data);
  }
}

export default PortfolioService;