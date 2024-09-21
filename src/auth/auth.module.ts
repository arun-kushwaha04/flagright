import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { RootConfigModule } from 'src/config/root/root.module';
import { RootConfigService } from 'src/config/root/root.service';
import { AuthController } from './auth.controller';
import { CustomExceptionFilter } from 'src/exception.filter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    RootConfigModule,
    JwtModule.registerAsync({
      imports: [RootConfigModule],
      useFactory: async (RootConfigService: RootConfigService) => ({
        secret: RootConfigService.jwtSecret,
        signOptions: { expiresIn: '1h' },
      }),
      inject: [RootConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
