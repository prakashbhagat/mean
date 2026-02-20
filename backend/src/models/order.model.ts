import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  userId: number;
  productIds: string[];
  totalAmount: number;
}

const orderSchema: Schema = new Schema({
  userId: { type: Number, required: true },
  productIds: [{ type: String, required: true }],
  totalAmount: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', orderSchema);