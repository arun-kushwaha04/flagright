import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TransactionScheduler } from './transaction.scheduler';
import { TransactionQueueModule } from 'src/bullmq/transaction/transaction.module';
import { AuthModule } from 'src/auth/auth.module';
import { BankModule } from 'src/bank/bank.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from 'src/exception.filter';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TransactionQueueModule,
    AuthModule,
    BankModule,
    PrismaModule,
  ],
  controllers: [TransactionController],
  providers: [
    TransactionScheduler,
    TransactionService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
  exports: [TransactionService],
})
export class TransactionModule {}
