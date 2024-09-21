import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RootConfigService } from 'src/config/root/root.service';
import { InvalidToken, NoToken } from 'src/errors';
import { AuthService } from './auth.service';
// import { IUserGuard } from './dto/guard-user.dto';

// guard for protecting routes
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private rootConfigService: RootConfigService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const baseUrl = request.url;
    if (baseUrl == '/auth/signUp' || baseUrl == '/auth/signIn') return true;
    const token: string | null = request.cookies['token'];

    if (!token) {
      throw new NoToken();
    }

    try {
      const { userId } = await this.jwtService.verify(token, {
        secret: this.rootConfigService.jwtSecret,
      });

      const validUser = await this.authService.userExists(userId as number);
      if (!validUser) throw new InvalidToken();
      // const user: IUserGuard = {
      //   userId: userId as number,
      // };
      // // request.user = user;
      return true;
    } catch (error) {
      console.log('Token verification error', error);
      throw new InvalidToken();
    }
  }
}
