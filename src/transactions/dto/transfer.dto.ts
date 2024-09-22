import { z } from 'zod';

export const deafultTransferSchema = z.object({
  originBankId: z.number(),
  destinationUserId: z.number(),
  amount: z.number().min(0),
  description: z
    .string()
    .min(6, 'Transaction description should be atleast 6 words long')
    .max(100, 'Transaction description should be atmax 100 words long'),
});

export type IDefaultTransfer = {
  originBankId: number;
  destinationUserId: number;
  amount: number;
  description: string;
};

export const transferSchema = z.object({
  originBankId: z.number(),
  destinationUserId: z.number(),
  destinationBankId: z.number(),
  amount: z.number().min(0),
  description: z
    .string()
    .min(6, 'Transaction description should be atleast 6 words long')
    .max(100, 'Transaction description should be atmax 100 words long'),
});

export type ITransfer = {
  originBankId: number;
  destinationUserId: number;
  destinationBankId: number;
  amount: number;
  description: string;
};
