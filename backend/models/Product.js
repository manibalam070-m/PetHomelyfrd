import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, index: 'text' },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, default: 0 },
  category: {
    type: String,
    required: true,
    enum: ['Dogs', 'Cats', 'Birds', 'Fish', 'Small Pets', 'Food', 'Toys', 'Accessories', 'Medicine', 'Grooming'],
    index: true,
  },
  subCategory: String,
  brand: { type: String, default: 'Generic' },
  images: [{ public_id: String, url: String }],
  stock: { type: Number, required: true, default: 0 },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String, rating: Number, comment: String,
    createdAt: { type: Date, default: Date.now },
  }],
  tags: [String],
  isFeatured: { type: Boolean, default: false },
  petType: { type: String, enum: ['Dog', 'Cat', 'Bird', 'Fish', 'Small Pet', 'All'], default: 'All' },
  weight: String,
  ageRange: String,
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Product', productSchema);