import { $Enums } from '@prisma/client';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { ITransactionQueue, TRANSACTION_QUEUE } from '../constant';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionService } from 'src/transactions/transaction.service';
import { Job } from 'bull';
import { NotEnoughBalance } from 'src/errors';

@Injectable()
@Processor(TRANSACTION_QUEUE)
export class TransactionConsumer extends WorkerHost {
  constructor(
    private prisma: PrismaService,
    private transactionService: TransactionService,
  ) {
    super();
  }

  @OnWorkerEvent('completed')
  async onComplete(job: Job<ITransactionQueue>) {
    const transaction: ITransactionQueue = job.data;
    console.log(transaction.transactionId, 'completed');
    await this.transactionService.updateTransaction(
      transaction.transactionId,
      $Enums.TransactionState.FAILED,
    );
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<ITransactionQueue>, error: Error) {
    const transaction: ITransactionQueue = job.data;
    console.log(transaction.transactionId, error.message);
    await this.transactionService.updateTransaction(
      transaction.transactionId,
      $Enums.TransactionState.FAILED,
    );
  }

  async process(job: Job<ITransactionQueue>) {
    const transaction: ITransactionQueue = job.data;
    try {
      if (transaction.transactionType === $Enums.TransactionType.WITHDRAWL) {
        this.transactionService.performWidthwral(transaction);
      } else {
        this.transactionService.performWidthwral(transaction);
      }
      return { status: 'Completed', message: 'Transactions successfull' };
    } catch (error) {
      if (error instanceof NotEnoughBalance) {
        console.log(
          transaction.transactionId,
          'failed due to insufficient balance',
        );
        return job.moveToFailed({ message: error.message }, false);
      }
      throw error;
    }
  }
}
