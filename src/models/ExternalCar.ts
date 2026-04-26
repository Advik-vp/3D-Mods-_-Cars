import mongoose from 'mongoose';

const ExternalCarSchema = new mongoose.Schema({
  brand: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  category: { type: String, enum: ['suv', 'sedan', 'hatchback', 'supercar', 'sports', 'truck'], required: true },
  sketchfabUrl: { type: String, required: true },
  sketchfabModelId: { type: String, required: true },
  previewImage: { type: String, default: '' },
  supportedMods: { type: [String], default: ['paint', 'wheels', 'spoiler', 'headlights', 'interior'] },
  isApproved: { type: Boolean, default: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.ExternalCar || mongoose.model('ExternalCar', ExternalCarSchema);
