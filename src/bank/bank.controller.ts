import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { BankService } from './bank.service';
import { ZodPipe } from 'src/zod.expection';
import { createBankSchema, ICreateBank } from './dto/create-bank.dto';
import {
  addUserBankSchema,
  deleteUserBankSchema,
  IAddUserBank,
  IDeleteUserBank,
} from './dto/user-bank-balance.dto';
import { CustomRequest } from 'src/utils/interface';

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @HttpCode(201)
  @Post('create')
  async createBank(@Body(new ZodPipe(createBankSchema)) body: ICreateBank) {
    await this.bankService.createBank(body);
    return {
      message: 'New Bank added',
      payload: null,
      success: true,
    };
  }

  @HttpCode(200)
  @Get('get')
  async getBank() {
    const banks = await this.bankService.getBanks();
    return {
      message: 'Fetched banks',
      payload: banks,
      success: true,
    };
  }

  @HttpCode(200)
  @Get('getCurrencies')
  async getCurrencies() {
    const currencies = await this.bankService.getCurrencies();
    return {
      message: 'Fetched currencies',
      payload: currencies,
      success: true,
    };
  }

  @HttpCode(201)
  @Post('addBank')
  async addUserBank(
    @Body(new ZodPipe(addUserBankSchema)) body: IAddUserBank,
    @Req() req: CustomRequest,
  ) {
    await this.bankService.addUserBanks(req.user.userId, body.bankId);
    return {
      message: 'Added bank',
      payload: null,
      success: true,
    };
  }

  @HttpCode(200)
  @Post('deleteBank')
  async deleteUserBank(
    @Body(new ZodPipe(deleteUserBankSchema)) body: IDeleteUserBank,
    @Req() req: CustomRequest,
  ) {
    await this.bankService.deletUserBanks(req.user.userId, body.bankId);
    return {
      message: 'Deleted bank',
      payload: null,
      success: true,
    };
  }

  @HttpCode(200)
  @Get('getBankBalance')
  async getUserBankBalance(
    @Body(new ZodPipe(addUserBankSchema)) body: IAddUserBank,
    @Req() req: CustomRequest,
  ) {
    const balance = await this.bankService.getUserBankBalance(
      req.user.userId,
      body.bankId,
    );
    return {
      message: 'Fetched user balance',
      payload: balance,
      success: true,
    };
  }

  @HttpCode(200)
  @Get('getBanks')
  async getUserBanks(@Req() req: CustomRequest) {
    const banks = await this.bankService.getUserBanks(req.user.userId);
    return {
      message: 'Fetched user balance',
      payload: banks,
      success: true,
    };
  }
}
