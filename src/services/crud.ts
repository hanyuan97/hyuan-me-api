import { Model, Document, Query } from 'mongoose';

export class CrudService<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async getAll(
    page=1,
    limit=Number.MAX_SAFE_INTEGER,
    sortField?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<{ data: T[]; totalCount: number }> {
    let query: Query<T[], T> = this.model.find();
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

  async getById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async create(data: any): Promise<T> {
    if (data._id)
      delete data._id;
    return this.model.create(data);
  }

  async update(id: string, data: any): Promise<T | null> {
    if (data._id)
      delete data._id;
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }

  async deleteAll(): Promise<any> {
    return this.model.deleteMany({});
  }
}