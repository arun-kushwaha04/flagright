import { z } from 'zod';

export const withdrawlSchema = z.object({
  originBankId: z.number(),
  amount: z.number().min(0),
  description: z
    .string()
    .min(6, 'Transaction description should be atleast 6 words long')
    .max(100, 'Transaction description should be atmax 100 words long'),
});

export type IWithdrawl = {
  originBankId: number;
  amount: number;
  description: string;
};
