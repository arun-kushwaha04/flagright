import { $Enums } from '@prisma/client';
const ToUSDMapping = {
  INR: 0.01,
  RUB: 0.01,
  EUR: 1.11,
  JPY: 0.007,
  CNY: 0.14,
  USD: 1,
};

const FromUSDMapping = {
  INR: 83.54,
  RUB: 92.82,
  EUR: 0.9,
  JPY: 143.47,
  CNY: 7.05,
  USD: 1,
};

export const convertToUSD = (
  amount: number,
  currency: $Enums.Currency,
): number => {
  return ToUSDMapping[currency] * amount;
};

export const convertFromUSD = (
  amount: number,
  currency: $Enums.Currency,
): number => {
  return FromUSDMapping[currency] * amount;
};
