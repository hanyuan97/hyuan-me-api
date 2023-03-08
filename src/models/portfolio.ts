import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: false },
  order: { type: Number, required: false },
  date: { type: Date, required: false },
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;