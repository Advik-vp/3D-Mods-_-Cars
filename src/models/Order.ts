import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, default: 'Processing' }, // Processing, Shipped, Delivered
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true }, // 'Razorpay', 'Stripe'
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
