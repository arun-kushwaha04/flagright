import { Injectable } from '@nestjs/common';
import {
  BACKOFF,
  ITransactionQueue,
  MAX_TRIES,
  TRANSACTION_QUEUE,
} from '../constant';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class TransactionQueueService {
  constructor(
    @InjectQueue(TRANSACTION_QUEUE) private readonly transactionQueue: Queue,
  ) {}

  async addJob(data: ITransactionQueue) {
    await this.transactionQueue.add(data.transactionId.toString(), data, {
      attempts: MAX_TRIES,
      removeOnComplete: true,
      removeOnFail: true,
      backoff: BACKOFF,
    });
  }
}
