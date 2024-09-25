import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodPipe } from 'src/zod.expection';
import { createUserSchema, ICreateUser } from './dto/create-user.dto';
import { IUserCredentials, userCredSchema } from './dto/login-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('signUp')
  async signUp(@Body(new ZodPipe(createUserSchema)) body: ICreateUser) {
    await this.authService.singUp(body);
    return {
      message: 'Signed up successfully',
      payload: null,
      success: true,
    };
  }

  @HttpCode(200)
  @Post('signIn')
  async signIn(
    @Body(new ZodPipe(userCredSchema)) body: IUserCredentials,
    @Res() res: Response,
  ) {
    const userInfo = await this.authService.signIn(body);
    res.cookie('token', userInfo.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return res.status(HttpStatus.OK).json({
      message: 'Signed in successfully',
      payload: { ...userInfo.userInfo, userId: userInfo.userId },
      success: true,
    });
  }
}
