import { PaymentStatus, PaymentType } from '.prisma/transaction-service';

export interface CreatePayment {
  id?: string;
  fromId?: string;
  toId?: string;
  docId?: string;
  amount?: number;
  amountEth?: number;
  fee?: number;
  feeEth?: number;
  type: PaymentType;
  status?: PaymentStatus;
}
