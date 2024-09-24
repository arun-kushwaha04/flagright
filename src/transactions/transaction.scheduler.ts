import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TransactionService } from 'src/transactions/transaction.service';

@Injectable()
export class TransactionScheduler {
  constructor(
    @Inject(forwardRef(() => TransactionService))
    private readonly trasactionService: TransactionService,
  ) {}

  private count = 1;
  private isRunning = false;

  @Cron('* * * * * *')
  handleCorn() {
    if (this.isRunning) this.trasactionService.mockTransaction(this.count);
  }

  toggle() {
    this.isRunning = !this.isRunning;
    return this.isRunning;
  }

  set(newCount: number) {
    this.count = newCount;
    return this.count;
  }

  info() {
    return {
      isRunning: this.isRunning,
      count: this.count,
    };
  }
}
