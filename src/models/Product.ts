import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  compatibleCars: [{ type: String }], // Array of Indian car model names, e.g., 'Swift'
  image: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
