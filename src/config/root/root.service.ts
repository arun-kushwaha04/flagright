import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RootConfigService {
  constructor(private configService: ConfigService) {}

  get evironment(): string {
    return this.configService.get<string>('root-config.nodeEnv')!;
  }

  get port(): number {
    return this.configService.get<number>('root-config.port')!;
  }

  get jwtSecret(): string {
    return this.configService.get<string>('root-config.jwtSecret')!;
  }

  get redisHost(): string {
    return this.configService.get<string>('root-config.redisHost')!;
  }

  get redisPort(): number {
    return this.configService.get<number>('root-config.redisPort')!;
  }
}
