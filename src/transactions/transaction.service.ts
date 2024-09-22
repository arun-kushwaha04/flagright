import { $Enums } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { IDefaultTransfer, ITransfer } from './dto/transfer.dto';
import {
  BankUserNotExists,
  handleError,
  NotEnoughBalance,
  SameUserSameAccountTransfer,
} from 'src/errors';
import { BankService } from 'src/bank/bank.service';
import { convertFromUSD, convertToUSD } from 'src/utils/helperfunctions';
import { IWithdrawl } from './dto/withdrawl.dto';

export class TransactionService {
  constructor(
    private prisma: PrismaService,
    private bank: BankService,
  ) {}

  getTransferType(
    userId: number,
    destinationUserId?: number,
  ): $Enums.TransactionType {
    if (!destinationUserId) return $Enums.TransactionType.WITHDRAWL;
    if (userId == destinationUserId) return $Enums.TransactionType.SELFTRANSFER;
    return $Enums.TransactionType.TRANSFER;
  }

  async handleWithdrawl(userId: number, data: IWithdrawl) {
    try {
      // checking if both user have account the bank
      if (!this.bank.existUserBank(userId, data.originBankId))
        throw new BankUserNotExists();

      const originUserBankInfo = await this.bank.getUserBankInfo(
        userId,
        data.originBankId,
      );
      if (originUserBankInfo.balance < data.amount) {
        throw new NotEnoughBalance();
      }

      // transaction for ensuring atomicity
      await this.prisma.$transaction(async (prisma) => {
        // Create the transaction record
        await prisma.transaction.create({
          data: {
            originId: userId,
            destinationId: userId,
            originAmount: data.amount,
            originAmountCurrency: originUserBankInfo.currency,
            destinationAmount: data.amount,
            destinationAmountCurrency: originUserBankInfo.currency,
            originBankId: originUserBankInfo.bankId,
            description: data.description,
            type: this.getTransferType(userId),
          },
        });

        // Update origin user's bank balance
        await this.bank.updateUserBankBalance(
          userId,
          originUserBankInfo.bankId,
          -data.amount,
        );
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async handleTransfer(userId: number, data: ITransfer): Promise<void> {
    try {
      // checking if both user have account the bank
      if (
        !this.bank.existUserBank(userId, data.originBankId) ||
        !this.bank.existUserBank(data.destinationUserId, data.destinationBankId)
      )
        throw new BankUserNotExists();

      // checking if the destination and origin bank are same with same destination and origin users
      if (
        data.destinationUserId === userId &&
        data.destinationBankId === data.originBankId
      )
        throw new SameUserSameAccountTransfer();
      const originUserBankInfo = await this.bank.getUserBankInfo(
        userId,
        data.originBankId,
      );
      const destinationBankInfo = await this.bank.getUserBankInfo(
        data.destinationUserId,
        data.destinationBankId,
      );
      if (originUserBankInfo.balance < data.amount) {
        throw new NotEnoughBalance();
      }
      const destinationAmount = convertFromUSD(
        convertToUSD(data.amount, originUserBankInfo.currency),
        destinationBankInfo.currency,
      );

      // transaction for ensuring atomicity
      await this.prisma.$transaction(async (prisma) => {
        // Create the transaction record
        await prisma.transaction.create({
          data: {
            originId: userId,
            destinationId: data.destinationUserId,
            originAmount: data.amount,
            originAmountCurrency: originUserBankInfo.currency,
            destinationAmount: destinationAmount,
            destinationAmountCurrency: destinationBankInfo.currency,
            originBankId: originUserBankInfo.bankId,
            destinationBankId: destinationBankInfo.bankId,
            description: data.description,
            type: this.getTransferType(userId, data.destinationUserId),
          },
        });

        // Update origin user's bank balance
        await this.bank.updateUserBankBalance(
          userId,
          originUserBankInfo.bankId,
          -data.amount,
        );

        // Update destination user's bank balance
        await this.bank.updateUserBankBalance(
          data.destinationUserId,
          destinationBankInfo.bankId,
          destinationAmount,
        );
      });
    } catch (error) {
      throw handleError(error);
    }
  }
  async handleDeafultTransfer(
    userId: number,
    data: IDefaultTransfer,
  ): Promise<void> {
    try {
      const destinationBankInfo = await this.bank.getUserBankInfo(
        data.destinationUserId,
      );
      await this.handleTransfer(userId, {
        ...data,
        destinationBankId: destinationBankInfo.bankId,
      });
    } catch (error) {
      throw handleError(error);
    }
  }
}
