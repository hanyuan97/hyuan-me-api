import { Schema } from 'mongoose';

export interface LocalizedContent {
  en: string;
  zh_TW: string;
}

export const localizedContentSchema = new Schema<LocalizedContent>(
  {
    en: {
      type: String,
      required: true,
    },
    zh_TW: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);