import { Request, Response } from 'express';
import { CategoryService } from '../services/category';
import { CrudController } from './crud';
import Category, { CategoryDocument } from '../models/category';

export class CategoryController extends CrudController<CategoryDocument> {
  constructor(categoryService: CategoryService<CategoryDocument>) {
    super(categoryService);
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
}

const categoryService = new CategoryService<CategoryDocument>(Category);
const categoryController = new CategoryController(categoryService);

export default categoryController;