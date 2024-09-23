import { $Enums } from '@prisma/client';
export type ITransactionQueryRequest = {
  pageNumber: number;
  originIdFilter: {
    toFilter: boolean;
    filter?: string;
  };
  destinationIdFilter: {
    toFilter: boolean;
    filter?: string;
  };
  descriptionFilter: {
    toFilter: boolean;
    filter?: string;
  };
  currencyFilter: {
    toFilter: boolean;
    filter?: $Enums.Currency;
  };
  date;
};
