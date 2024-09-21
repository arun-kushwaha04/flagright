import { PrismaService } from 'src/prisma/prisma.service';
import { ICreateBank } from './dto/create-bank.dto';
import { Bank, Currency } from '@prisma/client';
import { handleError } from 'src/errors';

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
}
