import { $Enums } from '@prisma/client';
const ToUSDMapping = {
  INR: 83.25,
  RUB: 96.5,
  EUR: 0.92,
  JPY: 148.55,
  CNY: 7.3,
  USD: 1,
};

const FromUSDMapping = {
  INR: 0.012,
  RUB: 0.01,
  EUR: 1.08,
  JPY: 0.0067,
  CNY: 0.14,
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
