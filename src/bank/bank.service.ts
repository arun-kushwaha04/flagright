import { PrismaService } from 'src/prisma/prisma.service';
import { ICreateBank } from './dto/create-bank.dto';
import { Bank, Currency } from '@prisma/client';
import {
  BankNotFound,
  BankUserAlreadyExists,
  BankUserNotExists,
  handleError,
} from 'src/errors';

export class BankService {
  constructor(private prisma: PrismaService) {}

  async createBank(data: ICreateBank): Promise<Bank | void> {
    try {
      const bank = await this.prisma.bank.create({
        data: data,
      });
      return bank;
    } catch (error) {
      console.log('Bank creation error', error);
      throw handleError(error);
    }
  }

  async getBanks(): Promise<Bank[]> {
    try {
      const bank = await this.prisma.bank.findMany();
      return bank;
    } catch (error) {
      console.log('Error while getting banks', error);
      throw handleError(error);
    }
  }

  async getCurrencies(): Promise<string[]> {
    try {
      const currencies: string[] = [];
      // TODO: this can be cached to optimize performance
      Object.keys(Currency).forEach((key) => {
        currencies.push(key);
      });
      return currencies;
    } catch (error) {
      console.log('Error while getting banks', error);
      throw handleError(error);
    }
  }

  async bankExits(bankId: number): Promise<boolean> {
    try {
      const bank = await this.prisma.bank.findUnique({
        where: {
          id: bankId,
        },
      });

      if (bank) return true;
      return false;
    } catch (error) {
      throw handleError(error);
    }
  }

  async existUserBank(userId: number, bankId: number): Promise<boolean> {
    try {
      const bank = await this.prisma.userBank.findUnique({
        where: {
          userId_bankId: {
            userId: userId,
            bankId: bankId,
          },
        },
      });

      if (bank) return true;
      return false;
    } catch (error) {
      throw handleError(error);
    }
  }

  async addUserBanks(userId: number, bankId: number) {
    try {
      // checking if the bank exists
      if (!this.bankExits(bankId)) throw new BankNotFound();
      // checking if the user bank already exists
      if (this.existUserBank(userId, bankId)) throw new BankUserAlreadyExists();
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          banks: {
            create: {
              bank: {
                connect: {
                  id: bankId,
                },
              },
              balance: 0,
            },
          },
        },
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async deletUserBanks(userId: number, bankId: number) {
    try {
      // checking if the user bank already exists
      if (!this.existUserBank(userId, bankId)) throw new BankUserNotExists();
      await this.prisma.userBank.delete({
        where: {
          userId_bankId: {
            userId: userId,
            bankId: bankId,
          },
        },
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async getUserBankBalance(userId: number, bankId: number): Promise<number> {
    try {
      // checking if the user bank already exists
      if (!this.existUserBank(userId, bankId)) throw new BankUserNotExists();
      const userBank = await this.prisma.userBank.findUnique({
        where: {
          userId_bankId: {
            userId: userId,
            bankId: bankId,
          },
        },
        select: {
          balance: true,
        },
      });
      return userBank.balance;
    } catch (error) {
      throw handleError(error);
    }
  }

  async updateUserBankBalance(userId: number, bankId: number, amount: number) {
    try {
      // checking if the user bank already exists
      if (!this.existUserBank(userId, bankId)) throw new BankUserNotExists();
      await this.prisma.userBank.update({
        where: {
          userId_bankId: {
            userId: userId,
            bankId: bankId,
          },
        },
        data: {
          balance: amount,
        },
      });
    } catch (error) {
      throw handleError(error);
    }
  }
}
