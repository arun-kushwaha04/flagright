import { $Enums } from '@prisma/client';
export const TRANSACTION_QUEUE = 'transaction_queue';
export const MAX_TRIES = 5;
export const BACKOFF = 1000;

export type ITransactionQueue = {
  transactionId: number;
  originUserId: number;
  originBankId: number;
  destinationUserId?: number;
  destinationBankId?: number;
  amount: number;
  transactionType: $Enums.TransactionType;
};
