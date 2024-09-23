import { $Enums } from '@prisma/client';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { ITransactionQueue, TRANSACTION_QUEUE } from '../constant';
import { Injectable } from '@nestjs/common';
import { TransactionService } from 'src/transactions/transaction.service';
import { NotEnoughBalance } from 'src/errors';
import { Job, UnrecoverableError } from 'bullmq';

@Injectable()
@Processor(TRANSACTION_QUEUE)
export class TransactionQueueConsumer extends WorkerHost {
  constructor(private transactionService: TransactionService) {
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
        await this.transactionService.performWidthwral(transaction);
      } else {
        await this.transactionService.performTransfer(transaction);
      }
      return { status: 'Completed', message: 'Transactions successfull' };
    } catch (error) {
      if (error instanceof NotEnoughBalance) {
        console.log(
          transaction.transactionId,
          'failed due to insufficient balance',
        );
        throw new UnrecoverableError('Transaction failed');
      }
      throw error;
    }
  }
}
