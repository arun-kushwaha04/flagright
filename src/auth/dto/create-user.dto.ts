import { UserType } from '@prisma/client';
import { z } from 'zod';

export const createUserSchema = z.object({
  firstName: z.string().min(2).max(10),
  lastName: z.string().min(2).max(15),
  email: z.string().email(),
  password: z.string().min(6),
  userType: z.nativeEnum(UserType),
  defaultBankId: z.number(),
});

export type ICreateUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: UserType;
  defaultBankId: number;
};
