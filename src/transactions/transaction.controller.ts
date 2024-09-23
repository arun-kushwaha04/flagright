import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ZodPipe } from 'src/zod.expection';
import { IWithdrawl, withdrawlSchema } from './dto/withdrawl.dto';
import { CustomRequest } from 'src/utils/interface';
import { ITransfer, transferSchema } from './dto/transfer.dto';
import {
  ITransactionQueryRequest,
  transactionQuerySchema,
} from './dto/query.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('withdraw')
  async handleWidthraw(
    @Body(new ZodPipe(withdrawlSchema)) body: IWithdrawl,
    @Req() req: CustomRequest,
  ) {
    await this.transactionService.handleWithdrawl(req.user.userId, body);
    return {
      message: 'Withdrawl request created',
      payload: null,
      success: true,
    };
  }

  @Post('defaultTransfer')
  async handleDefaultTransfer(
    @Body(new ZodPipe(transferSchema)) body: ITransfer,
    @Req() req: CustomRequest,
  ) {
    await this.transactionService.handleDeafultTransfer(req.user.userId, body);
    return {
      message: 'Transfer request created',
      payload: null,
      success: true,
    };
  }
  @Post('transfer')
  async handleTransfer(
    @Body(new ZodPipe(transferSchema)) body: ITransfer,
    @Req() req: CustomRequest,
  ) {
    await this.transactionService.handleTransfer(req.user.userId, body);
    return {
      message: 'Transfer request created',
      payload: null,
      success: true,
    };
  }

  @Get(':id')
  async fetchTransactionById(
    @Param('id') transactionId: number,
    @Req() req: CustomRequest,
  ) {
    return {
      message: 'Feteched transaction information',
      payload: await this.transactionService.fetchTransactionById(
        req.user.userId,
        transactionId,
      ),
      success: true,
    };
  }

  @Post()
  async fetchTransactions(
    @Body(new ZodPipe(transactionQuerySchema)) body: ITransactionQueryRequest,
    @Req() req: CustomRequest,
  ) {
    return {
      message: 'Feteched transaction information',
      payload: await this.transactionService.fetchTransactions(
        req.user.userId,
        body,
      ),
      success: true,
    };
  }

  @Get('toggleCorn')
  async toggleCorn() {
    return {
      message: 'Toggled corn status',
      payload: await this.transactionService.toggleCorn(),
      success: true,
    };
  }

  @Get('updateCornCount')
  async updateCornJobCount(@Query('count') count: number) {
    return {
      message: 'Toggled corn status',
      payload: await this.transactionService.updateCornJobCount(count),
      success: true,
    };
  }

  @Get('cornInfo')
  async getCornInfo() {
    return {
      message: 'Toggled corn status',
      payload: await this.transactionService.getCornInfo(),
      success: true,
    };
  }
}
