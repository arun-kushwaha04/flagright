import { BullModule } from '@nestjs/bullmq';
import { forwardRef, Module } from '@nestjs/common';
import { TRANSACTION_QUEUE } from '../constant';
import { TransactionQueueConsumer } from './transaction.consumer';
import { TransactionQueueService } from './transaction.service';
import { TransactionModule } from 'src/transactions/transaction.module';
@Module({
  imports: [
    BullModule.registerQueue({
      name: TRANSACTION_QUEUE,
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    forwardRef(() => TransactionModule),
  ],
  providers: [TransactionQueueConsumer, TransactionQueueService],
  exports: [TransactionQueueService],
})
export class TransactionQueueModule {}
