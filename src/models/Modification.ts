import mongoose from 'mongoose';

const ModificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }, // Name of the configuration preset
  carModel: { type: String, required: true },
  config: {
    baseModel: { type: String, default: 'sedan' },
    color: { type: String, default: '#ffffff' },
    wheels: { type: String, default: 'standard' },
    bodyKit: { type: String, default: 'none' },
    spoiler: { type: String, default: 'none' },
    headlights: { type: String, default: 'standard' },
    interiorColor: { type: String, default: '#000000' },
    windowTint: { type: String, default: 'light' }
  },
  previewImage: { type: String, default: '' }, // Base64 or Object URL of the 3D snapshot
  isPublic: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  comments: [{
    userName: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.models.Modification || mongoose.model('Modification', ModificationSchema);
