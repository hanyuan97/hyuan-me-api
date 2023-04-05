// import mongoose from 'mongoose';

// const portfolioSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   titleEN: { type: String, required: false },
//   descriptionEN: { type: String, required: false },
//   images: { type: [String], required: false },
//   order: { type: Number, required: false },
//   date: { type: Date, required: false },
//   categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
// });

// const Portfolio = mongoose.model('Portfolio', portfolioSchema);

// export default Portfolio;


import mongoose, { Document } from 'mongoose';
import {LocalizedContent, localizedContentSchema} from "../types/i18n"

export interface PortfolioData extends Document {
  title: LocalizedContent;
  description: LocalizedContent;
  order: number;
  images: string[];
  time: string;
  github: string;
  date: Date;
  categories: string[];
}

export interface PortfolioDocument extends PortfolioData, Document {}

const portfolioSchema = new mongoose.Schema<PortfolioDocument>(
  {
    title: { type: localizedContentSchema, required: false },
    description: { type: localizedContentSchema, required: false },
    order: { type: Number, required: false },
    images: { type: [String], required: false },
    time: { type: String, required: false },
    github: { type: String, required: false },
    date: { type: Date, required: false },
    categories: [{ type: mongoose.Types.ObjectId, ref: 'Category' }],
  },
  { timestamps: true }
);

const Portfolio = mongoose.model<PortfolioDocument>('Portfolio', portfolioSchema);

export default Portfolio;