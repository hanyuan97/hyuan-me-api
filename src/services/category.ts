import { Model, Document } from 'mongoose';
import { CrudService } from './crud';

export class CategoryService<T extends Document> extends CrudService<T> {
  constructor(model: Model<T>) {
    super(model);
  }
}