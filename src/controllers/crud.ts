import { Request, Response } from 'express';
import { CrudService } from '../services/crud';
import { Document } from 'mongoose';

export class CrudController<T extends Document> {
  public crudService: CrudService<T>;

  constructor(crudService: CrudService<T>) {
    this.crudService = crudService;
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const items = await this.crudService.getAll();
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const item = await this.crudService.getById(id);
      if (!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }
      res.json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const item = await this.crudService.create(req.body);
      res.json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const item = await this.crudService.update(id, req.body);
      if (!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }
      res.json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const item = await this.crudService.delete(id);
      if (!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }
      res.json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}