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

export interface CategoryData {
  title: string;
}

export interface CategoryDocument extends CategoryData, Document {}

const CategorySchema = new mongoose.Schema<CategoryDocument>(
  {
    title: { type: String, required: true },
  },
  { timestamps: true }
);

const Category = mongoose.model<CategoryDocument>('Category', CategorySchema);

export default Category;