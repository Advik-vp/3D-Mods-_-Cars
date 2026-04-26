import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true, default: '' },
  carModel: { type: String, default: 'Standard Sedan' },
  profilePicture: { type: String, default: '' },
  twoFactorEnabled: { 
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false }
  },
  otpSecret: { type: String, default: null },
  otpExpiresAt: { type: Date, default: null },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
