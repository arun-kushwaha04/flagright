import { $Enums } from '@prisma/client';
export const TRANSACTION_QUEUE = 'transaction_queue';

export type ITransactionQueue = {
  transactionId: number;
  originUserId: number;
  originBankId: number;
  destinationUserId?: number;
  destinationBankId?: number;
  amount: number;
  description: string;
  transactionType: $Enums.TransactionType;
};
