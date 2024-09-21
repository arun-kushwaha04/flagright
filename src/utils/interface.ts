import { Request } from 'express';
import { IUserGuard } from 'src/auth/dto/guard-user.dto';

export interface CustomRequest extends Request {
  user: IUserGuard;
}
