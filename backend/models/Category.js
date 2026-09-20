import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  image: { public_id: String, url: String },
  icon: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);