import { z } from 'zod';
import { Currency } from '@prisma/client';

export const createBankSchema = z.object({
  name: z.string().min(3),
  currency: z.nativeEnum(Currency),
});

export type ICreateBank = {
  name: string;
  currency: Currency;
};
