import { z } from 'zod';
import { $Enums, Transaction } from '@prisma/client';

export type ITransactionQueryRequest = {
  pageNumber: number;
  itemPerPage: number;
  filter: IFilter;
};

export type ITransactionQueryResponse = {
  pageNumber: number;
  itemPerPage: number;
  totalPage: number;
  transactions: Array<Transaction>;
};

const FilterSchema = z.object({
  allTransactionFilter: z.object({
    toFilter: z.boolean(),
    value: z.boolean().optional(),
  }),
  originBankIdFilter: z.object({
    toFilter: z.boolean(),
    value: z.number().optional(),
  }),
  destinationIdFilter: z.object({
    toFilter: z.boolean(),
    value: z.number().optional(),
  }),
  destinationBankIdFilter: z.object({
    toFilter: z.boolean(),
    value: z.number().optional(),
  }),
  descriptionFilter: z.object({
    toFilter: z.boolean(),
    value: z.string().optional(),
  }),
  currencyFilter: z.object({
    toFilter: z.boolean(),
    value: z.array(z.nativeEnum($Enums.Currency)).optional(),
  }),
  dateFilter: z.object({
    toFilter: z.boolean(),
    value: z
      .object({
        start: z.number(),
        end: z.number(),
      })
      .optional(),
  }),
  statusFilter: z.object({
    toFilter: z.boolean(),
    value: z.nativeEnum($Enums.TransactionState).optional(),
  }),
  typeFilter: z.object({
    toFilter: z.boolean(),
    value: z.nativeEnum($Enums.TransactionType).optional(),
  }),
  amountFilter: z.object({
    toFilter: z.boolean(),
    value: z
      .object({
        start: z.number(),
        end: z.number(),
      })
      .optional(),
  }),
});

export type IFilter = {
  allTransactionFilter: {
    toFilter: boolean;
    value?: boolean;
  };
  originBankIdFilter: {
    toFilter: boolean;
    value?: number;
  };
  destinationIdFilter: {
    toFilter: boolean;
    value?: number;
  };
  destinationBankIdFilter: {
    toFilter: boolean;
    value?: number;
  };
  descriptionFilter: {
    toFilter: boolean;
    value?: string;
  };
  currencyFilter: {
    toFilter: boolean;
    value?: Array<$Enums.Currency>;
  };
  dateFilter: {
    toFilter: boolean;
    value?: {
      start: Date;
      end: Date;
    };
  };
  statusFilter: {
    toFilter: boolean;
    value?: $Enums.TransactionState;
  };
  typeFilter: {
    toFilter: boolean;
    value?: $Enums.TransactionState;
  };
  amountFilter: {
    toFilter: boolean;
    value?: {
      start: number;
      end: number;
    };
  };
};

export const transactionQuerySchema = z.object({
  pageNumber: z.number(),
  itemPerPage: z.number(),
  filter: FilterSchema,
});
