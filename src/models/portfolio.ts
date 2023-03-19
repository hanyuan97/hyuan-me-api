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

export interface PortfolioData {
  title: string;
  description: string;
  order: number;
  images: string[];
  date: Date;
  categories: string[];
}

export interface PortfolioDocument extends PortfolioData, Document {}

const portfolioSchema = new mongoose.Schema<PortfolioDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, required: true },
    images: { type: [String], required: true },
    date: { type: Date, required: true },
    categories: [{ type: mongoose.Types.ObjectId, ref: 'Category' }],
  },
  { timestamps: true }
);

const Portfolio = mongoose.model<PortfolioDocument>('Portfolio', portfolioSchema);

export default Portfolio;