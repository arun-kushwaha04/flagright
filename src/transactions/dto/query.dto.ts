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
