import { Body, Controller, Get, Post } from '@nestjs/common';
import { BankService } from './bank.service';
import { ZodPipe } from 'src/zod.expection';
import { createBankSchema, ICreateBank } from './dto/create-bank.dto';

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post('create')
  async createBank(@Body(new ZodPipe(createBankSchema)) body: ICreateBank) {
    await this.bankService.createBank(body);
    return {
      message: 'New Bank added',
      payload: null,
      success: true,
    };
  }

  @Get('get')
  async getBank() {
    const banks = await this.bankService.getBanks();
    return {
      message: 'Fetched banks',
      payload: banks,
      success: true,
    };
  }

  @Get('getCurrencies')
  async getCurrencies() {
    const currencies = await this.bankService.getCurrencies();
    return {
      message: 'Fetched currencies',
      payload: currencies,
      success: true,
    };
  }
}
