import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodPipe } from 'src/zod.expection';
import { createUserSchema, ICreateUser } from './dto/create-user.dto';
import { IUserCredentials, userCredSchema } from './dto/login-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async signUp(@Body(new ZodPipe(createUserSchema)) body: ICreateUser) {
    await this.authService.singUp(body);
    return {
      message: 'Signed up successfully',
      payload: null,
      success: true,
    };
  }

  @Post('signIn')
  async signIn(
    @Body(new ZodPipe(userCredSchema)) body: IUserCredentials,
    @Res() res: Response,
  ) {
    const token = await this.authService.signIn(body);
    res.cookie('token', token, { httpOnly: true });

    return res.json({
      message: 'Signed in successfully',
      payload: null,
      success: true,
    });
  }
}
