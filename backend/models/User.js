import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
  },
  password: { type: String, required: true, minlength: 6, select: false },
  phone: { type: String, default: '' },
  avatar: {
    public_id: String,
    url: { type: String, default: 'https://res.cloudinary.com/demo/image/upload/v1/default-avatar.png' },
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  address: {
    street: String, city: String, state: String, zipCode: String, country: String,
  },
  pets: [{
    name: String, type: String, breed: String, age: Number, image: String,
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export default mongoose.model('User', userSchema);