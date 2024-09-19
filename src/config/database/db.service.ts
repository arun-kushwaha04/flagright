import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RootConfigService } from '../root/root.service';
import { IDBConfig } from './db.config';

@Injectable()
export class DBConfigService {
  constructor(
    private configService: ConfigService,
    private rootConfigService: RootConfigService,
  ) {}

  get dbConnectionString(): string {
    const envType = this.rootConfigService.evironment;
    const dbUrls = this.configService.get<IDBConfig>('db-config')!;

    if (envType === 'test') return dbUrls.dbConnectionStringTest;
    else if (envType === 'development') return dbUrls.dbConnectionStringDev;
    return dbUrls.dbConnectionStringProd;
  }
}
