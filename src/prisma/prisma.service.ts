import { Injectable } from '@nestjs/common';
import { $Enums, PrismaClient } from '@prisma/client';
import { DBConfigService } from 'src/config/database/db.service';
import { RootConfigService } from 'src/config/root/root.service';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(
    config: DBConfigService,
    private rootConfig: RootConfigService,
  ) {
    super({
      datasources: {
        db: {
          url: config.dbConnectionString,
        },
      },
    });
  }

  async onModuleInit(): Promise<void> {
    console.log('Connecting to database');
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  async cleanDb(): Promise<any[]> {
    if (this.rootConfig.evironment === 'test') {
      const promise = [];
      promise.push(this.user.deleteMany({}));
      return Promise.all(promise);
    }
    return [];
  }

  static UserTypes = $Enums.UserType;
  static CurrencyTypes = $Enums.Currency;
}
