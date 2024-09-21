import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RootConfigModule } from './config/root/root.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BankModule } from './bank/bank.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),
    PrismaModule,
    AuthModule,
    BankModule,
    RootConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
