import { Schema, model } from 'mongoose';

const potionSchema = new Schema({
  name: String,
  price: Number,
  score: Number,
  ingredients: [Schema.Types.Mixed],
  ratings: { strength: Number, flavor: Number },
  tryDate: Date,
  categories: [String],
  vendor_id: String
});

export const Potion = model('Potion', potionSchema);