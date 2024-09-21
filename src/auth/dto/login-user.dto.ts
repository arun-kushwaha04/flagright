import { z } from 'zod';

export const userCredSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type IUserCredentials = {
  email: string;
  password: string;
};
