export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  address: string;
  createdAt: Date;
}

export interface Lot {
  id: string;
  code: string;
  location: string;
  dimensions: {
    width: number;
    length: number;
  };
  totalPrice: number;
  status: 'available' | 'reserved' | 'sold';
  description: string;
  images: string[];
}

export interface Contract {
  id: string;
  clientId: string;
  lotId: string;
  totalAmount: number;
  installments: number;
  installmentAmount: number;
  startDate: Date;
  status: 'active' | 'completed' | 'defaulted';
  payments: Payment[];
  signedAt?: Date;
}

export interface Payment {
  id: string;
  contractId: string;
  amount: number;
  dueDate: Date;
  paidAt?: Date;
  status: 'pending' | 'paid' | 'overdue';
  paymentMethod?: string;
  transactionId?: string;
}