import { BullModule } from '@nestjs/bullmq';
import { forwardRef, Module } from '@nestjs/common';
import { TRANSACTION_QUEUE } from '../constant';
import { TransactionQueueConsumer } from './transaction.consumer';
import { TransactionQueueService } from './transaction.service';
import { TransactionModule } from 'src/transactions/transaction.module';
import { RootConfigModule } from 'src/config/root/root.module';
import { RootConfigService } from 'src/config/root/root.service';
@Module({
  imports: [
    BullModule.registerQueueAsync({
      imports: [RootConfigModule],
      name: TRANSACTION_QUEUE,
      useFactory: async (rootConfigService: RootConfigService) => ({
        connection: {
          host: rootConfigService.redisHost,
          port: rootConfigService.redisPort,
        },
      }),
      inject: [RootConfigService],
    }),
    forwardRef(() => TransactionModule),
  ],
  providers: [TransactionQueueConsumer, TransactionQueueService],
  exports: [TransactionQueueService],
})
export class TransactionQueueModule {}
