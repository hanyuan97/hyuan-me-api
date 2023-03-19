import { Model, Document } from 'mongoose';

export class CrudService<T extends Document> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async getAll(): Promise<T[]> {
    return this.model.find();
  }

  async getById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async create(data: any): Promise<T> {
    return this.model.create(data);
  }

  async update(id: string, data: any): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }
}