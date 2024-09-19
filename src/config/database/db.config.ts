import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import JoiUtil, { JoiConfig } from 'src/utils/env.utils';

export type IDBConfig = {
  dbConnectionStringProd: string;
  dbConnectionStringTest: string;
  dbConnectionStringDev: string;
};

export default registerAs('db-config', (): IDBConfig => {
  const configs: JoiConfig<IDBConfig> = {
    dbConnectionStringProd: {
      value: process.env.DB_CONNECTION_URL_PRODUCTION,
      joi: Joi.string().required(),
    },
    dbConnectionStringTest: {
      value: process.env.DB_CONNECTION_URL_TESTING,
      joi: Joi.string().required(),
    },
    dbConnectionStringDev: {
      value: process.env.DB_CONNECTION_URL_DEVELOPMENT,
      joi: Joi.string().required(),
    },
  };

  return JoiUtil.validate(configs);
});
