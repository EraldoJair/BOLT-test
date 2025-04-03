import mongoose from 'mongoose';
import { z } from 'zod';

// const MONGODB_URI = 'mongodb+srv://eraldovaldivia:123$Eraldo$123@crmprueba.wozor.mongodb.net/?retryWrites=true&w=majority&appName=CRMprueba';
const MONGODB_URI = 'mongodb+srv://eraldovaldivia:123$Eraldo$123@crmprueba.wozor.mongodb.net/?retryWrites=true&w=majority&appName=real_estate';

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Schemas
const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  document: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const lotSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  dimensions: {
    width: { type: Number, required: true },
    length: { type: Number, required: true },
  },
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['available', 'reserved', 'sold'],
    default: 'available'
  },
  description: { type: String, required: true },
  images: [{ type: String }],
});

const contractSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  lotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lot', required: true },
  totalAmount: { type: Number, required: true },
  installments: { type: Number, required: true },
  installmentAmount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  status: { 
    type: String,
    enum: ['active', 'completed', 'defaulted'],
    default: 'active'
  },
  signedAt: { type: Date },
});

const paymentSchema = new mongoose.Schema({
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  paidAt: { type: Date },
  status: { 
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending'
  },
  paymentMethod: { type: String },
  transactionId: { type: String },
});

// Zod Validation Schemas
export const ClientValidation = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  document: z.string().min(5),
  address: z.string().min(5),
});

export const LotValidation = z.object({
  code: z.string().min(3),
  location: z.string().min(5),
  dimensions: z.object({
    width: z.number().positive(),
    length: z.number().positive(),
  }),
  totalPrice: z.number().positive(),
  description: z.string().min(10),
  images: z.array(z.string().url()),
});

// Models
export const Client = mongoose.model('Client', clientSchema);
export const Lot = mongoose.model('Lot', lotSchema);
export const Contract = mongoose.model('Contract', contractSchema);
export const Payment = mongoose.model('Payment', paymentSchema);