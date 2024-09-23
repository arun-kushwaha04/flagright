import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TRANSACTION_QUEUE } from '../constant';
import { TransactionQueueConsumer } from './transaction.consumer';
import { TransactionQueueService } from './transaction.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: TRANSACTION_QUEUE,
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  providers: [TransactionQueueConsumer, TransactionQueueService],
  exports: [TransactionQueueService],
})
export class TransactionQueueModule {}
