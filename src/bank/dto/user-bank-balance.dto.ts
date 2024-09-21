import * as z from 'zod';

export const addUserBankSchema = z.object({
  bankId: z.number(),
});

export const deleteUserBankSchema = z.object({
  bankId: z.number(),
});

export const updateUserBankBalanceSchema = z.object({
  bankId: z.number(),
  amount: z.number(),
});

export type IAddUserBank = {
  bankId: number;
};

export type IDeleteUserBank = {
  bankId: number;
};

export type IUpdateUserBankBalance = {
  bankId: number;
  amount: number;
};
