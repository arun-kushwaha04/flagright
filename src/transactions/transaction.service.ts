import { $Enums, Transaction } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { IDefaultTransfer, ITransfer } from './dto/transfer.dto';
import {
  BankUserNotExists,
  handleError,
  NotAuthorized,
  NotEnoughBalance,
  SameUserSameAccountTransfer,
} from 'src/errors';
import { BankService } from 'src/bank/bank.service';
import { convertFromUSD, convertToUSD } from 'src/utils/helperfunctions';
import { IWithdrawl } from './dto/withdrawl.dto';
import { ITransactionQueue } from 'src/bullmq/constant';
import { TransactionQueueService } from 'src/bullmq/transaction/transaction.service';
import {
  IFilter,
  ITransactionQueryRequest,
  ITransactionQueryResponse,
} from './dto/query.dto';

export class TransactionService {
  constructor(
    private prisma: PrismaService,
    private bank: BankService,
    private readonly transactionQueueService: TransactionQueueService,
  ) {}

  getTransferType(
    userId: number,
    destinationUserId?: number,
  ): $Enums.TransactionType {
    if (!destinationUserId) return $Enums.TransactionType.WITHDRAWL;
    if (userId == destinationUserId) return $Enums.TransactionType.SELFTRANSFER;
    return $Enums.TransactionType.TRANSFER;
  }

  async updateTransaction(
    transactionId: number,
    status: $Enums.TransactionState,
  ) {
    await this.prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        state: status,
      },
    });
  }

  async handleWithdrawl(userId: number, data: IWithdrawl) {
    try {
      // checking if both user have account the bank
      if (!this.bank.existUserBank(userId, data.originBankId))
        throw new BankUserNotExists();

      // getting bank info of origin user
      const originUserBankInfo = await this.bank.getUserBankInfo(
        userId,
        data.originBankId,
      );

      //creating a new transaction
      const transaction = await this.prisma.transaction.create({
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

      // adding transaction to the queue
      this.transactionQueueService.addJob({
        ...data,
        transactionId: transaction.id,
        originUserId: userId,
        transactionType: this.getTransferType(userId),
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async performWidthwral(data: ITransactionQueue): Promise<void> {
    return await this.prisma.$transaction(async (prisma) => {
      // Setting transaction isolation level to seralizable
      await prisma.$executeRaw`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`;

      // getting origin user bank info
      const originUserBankInfo = await this.bank.getUserBankInfo(
        data.originUserId,
        data.originBankId,
      );

      // checking if there is enough balance to execute transaction
      if (originUserBankInfo.balance < data.amount)
        throw new NotEnoughBalance();

      // Update origin user's bank balance
      await this.bank.updateUserBankBalance(
        data.originUserId,
        originUserBankInfo.bankId,
        originUserBankInfo.balance - data.amount,
      );
    });
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

      // getting bank info of origin user
      const originUserBankInfo = await this.bank.getUserBankInfo(
        userId,
        data.originBankId,
      );

      // getting bank info of origin user
      const destinationBankInfo = await this.bank.getUserBankInfo(
        data.destinationUserId,
        data.destinationBankId,
      );

      // converting amount in same currency
      const destinationAmount = convertFromUSD(
        convertToUSD(data.amount, originUserBankInfo.currency),
        destinationBankInfo.currency,
      );

      // creating a new transaction
      const transaction = await this.prisma.transaction.create({
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

      // adding transaction to the queue
      this.transactionQueueService.addJob({
        ...data,
        transactionId: transaction.id,
        originUserId: userId,
        transactionType: this.getTransferType(userId),
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

  async performTransfer(data: ITransactionQueue): Promise<void> {
    return await this.prisma.$transaction(async (prisma) => {
      // Setting transaction isolation level to seralizable
      await prisma.$executeRaw`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`;

      // getting origin user bank info
      const originUserBankInfo = await this.bank.getUserBankInfo(
        data.originUserId,
        data.originBankId,
      );

      // getting desination user bank info
      const destinationBankInfo = await this.bank.getUserBankInfo(
        data.destinationUserId,
        data.destinationBankId,
      );

      // checking if there is enough balance to execute transaction
      if (originUserBankInfo.balance < data.amount)
        throw new NotEnoughBalance();

      // converting the currency
      const destinationAmount = convertFromUSD(
        convertToUSD(data.amount, originUserBankInfo.currency),
        destinationBankInfo.currency,
      );
      // Update origin user's bank balance
      await this.bank.updateUserBankBalance(
        data.originUserId,
        originUserBankInfo.bankId,
        originUserBankInfo.balance - data.amount,
      );

      // Update destination user's bank balance
      await this.bank.updateUserBankBalance(
        data.destinationUserId,
        destinationBankInfo.bankId,
        destinationBankInfo.balance + destinationAmount,
      );
    });
  }

  async fetchTransactionById(userId: number, transactionId: number) {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: {
          id: transactionId,
          OR: [{ originId: userId }, { destinationId: userId }],
        },
      });
      if (!transaction) throw new NotAuthorized();
      return transaction;
    } catch (error) {
      throw handleError(error);
    }
  }

  buildFilter(userId: number, query: IFilter) {
    const filters: any = {};

    // Origin ID Filter
    if (
      query.allTransactionFilter.toFilter &&
      query.allTransactionFilter.value
    ) {
      filters.originId = userId;
    }

    // Origin Bank ID Filter
    if (query.originBankIdFilter.toFilter && query.originBankIdFilter.value) {
      filters.originBankId = query.originBankIdFilter.value;
    }

    // Destination ID Filter
    if (query.destinationIdFilter.toFilter && query.destinationIdFilter.value) {
      filters.destinationId = query.destinationIdFilter.value;
    }

    // Destination Bank ID Filter
    if (
      query.destinationBankIdFilter.toFilter &&
      query.destinationBankIdFilter.value
    ) {
      filters.destinationBankId = query.destinationBankIdFilter.value;
    }

    // Description Filter (Using Prisma's `contains` or raw SQL for regex)
    if (query.descriptionFilter.toFilter && query.descriptionFilter.value) {
      filters.description = {
        contains: query.descriptionFilter.value, // For substring match
        mode: 'insensitive', // Optional: Case insensitive
      };
    }

    // Currency Filter (Array of Currencies)
    if (query.currencyFilter.toFilter && query.currencyFilter.value) {
      filters.originAmountCurrency = {
        in: query.currencyFilter.value, // Matches any currency in the array
      };
      filters.destinationAmountCurrency = {
        in: query.currencyFilter.value, // Matches any currency in the array
      };
    }

    // Date Range Filter
    if (query.dateFilter.toFilter && query.dateFilter.value) {
      filters.createdAt = {
        gte: query.dateFilter.value.start, // Greater than or equal to the start date
        lte: query.dateFilter.value.end, // Less than or equal to the end date
      };
    }

    // Status Filter
    if (query.statusFilter.toFilter && query.statusFilter.value) {
      filters.status = query.statusFilter.value;
    }

    // Type Filter
    if (query.typeFilter.toFilter && query.typeFilter.value) {
      filters.type = query.typeFilter.value;
    }

    // Amount Range Filter
    if (query.amountFilter.toFilter && query.amountFilter.value) {
      filters.originAmount = {
        gte: query.amountFilter.value.start, // Greater than or equal to start amount
        lte: query.amountFilter.value.end, // Less than or equal to end amount
      };
    }

    return filters;
  }

  async fetchTransactions(
    userId: number,
    query: ITransactionQueryRequest,
  ): Promise<ITransactionQueryResponse> {
    try {
      const { pageNumber = 0, itemPerPage = 10, filter } = query;

      const transactionFilter = this.buildFilter(userId, filter);

      const totalItem = await this.prisma.transaction.count({
        where: transactionFilter,
      });

      const totalPage = Math.ceil(totalItem / itemPerPage);
      let transactions: Array<Transaction>;
      if (pageNumber === 0) {
        transactions = await this.prisma.transaction.findMany({
          take: itemPerPage,
          where: transactionFilter,
          orderBy: {
            createdAt: 'desc',
          },
        });
      } else {
        const itemToSkip = (pageNumber - 1) * itemPerPage;
        const firstResult = await this.prisma.transaction.findMany({
          take: itemToSkip,
          where: transactionFilter,
          orderBy: {
            createdAt: 'desc',
          },
        });
        const cursorId = firstResult[firstResult.length - 1].id;
        transactions = await this.prisma.transaction.findMany({
          take: itemPerPage,
          where: transactionFilter,
          cursor: {
            id: cursorId,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      }
      return {
        pageNumber,
        itemPerPage,
        totalPage,
        transactions,
      };
    } catch (error) {
      throw handleError(error);
    }
  }
}
