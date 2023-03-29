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
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortField = req.query.sortField as string || 'order';
      const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'asc';

      const { data, totalCount } = await this.crudService.getAll(page, limit, sortField, sortOrder);
      
      res.json({
        data,
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        sortField,
        sortOrder,
      });
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
      console.log(req.body);
      
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

  async deleteAll(req: Request, res: Response) {
    const item = await this.crudService.deleteAll();
    res.json(item);
  }
}