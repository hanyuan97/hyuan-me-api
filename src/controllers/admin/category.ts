import { Request, Response } from 'express';
import { CategoryService } from '../../services/category';
import { CrudController } from '../crud';
import Category, { CategoryDocument } from '../../models/category';

export class CategoryController extends CrudController<CategoryDocument> {
  constructor(categoryService: CategoryService<CategoryDocument>) {
    super(categoryService);
  }
}

const categoryService = new CategoryService<CategoryDocument>(Category);
const categoryController = new CategoryController(categoryService);

export default categoryController;