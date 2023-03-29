// import mongoose from 'mongoose';

// const categorySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
// });

// const Category = mongoose.model('Category', categorySchema);
// export default Category;

import mongoose, { Document } from 'mongoose';

import {LocalizedContent, localizedContentSchema} from "../types/i18n"

export interface CategoryData {
  title: LocalizedContent;
  order: Number;
}

export interface CategoryDocument extends CategoryData, Document {}

const CategorySchema = new mongoose.Schema<CategoryDocument>(
  {
    title: { type: localizedContentSchema, required: true },
    order: { type: Number, required: false }
  },
  { timestamps: true }
);

const Category = mongoose.model<CategoryDocument>('Category', CategorySchema);

export default Category;