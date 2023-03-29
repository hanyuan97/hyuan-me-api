import { Model, Document } from 'mongoose';
import { CrudService } from './crud';

export class CategoryService<T extends Document> extends CrudService<T> {
  constructor(model: Model<T>) {
    super(model);
  }
  async create(data: any): Promise<T> {
    if (data._id!==null) delete data._id;
    if (!data.order) {
      const maxOrder:any = await this.model.findOne().sort('-order');
      const newOrder = maxOrder ? maxOrder.order + 1 : 0;
      data.order = newOrder
    }
    return this.model.create(data);
  }
}