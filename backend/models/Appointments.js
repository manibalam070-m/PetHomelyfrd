import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ownerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  petName: { type: String, required: true },
  petType: { type: String, required: true },
  service: {
    type: String,
    enum: ['Grooming', 'Veterinary Checkup', 'Vaccination', 'Training', 'Boarding', 'Day Care'],
    required: true,
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  notes: String,
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);