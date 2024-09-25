/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import JoiUtil, { JoiConfig } from 'src/utils/env.utils';

export type IRootConfig = {
  nodeEnv: string;
  port: number;
  jwtSecret: string;
  redisHost: string;
  redisPort: number;
};

export default registerAs('root-config', (): IRootConfig => {
  const configs: JoiConfig<IRootConfig> = {
    nodeEnv: {
      value: process.env.NODE_ENV,
      joi: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    },
    port: {
      value: process.env.PORT,
      joi: Joi.number().port().default(5000),
    },
    jwtSecret: {
      value: process.env.JWT_SECRET,
      joi: Joi.string(),
    },
    redisHost: {
      value: process.env.REDIS_HOST,
      joi: Joi.string().default('redis'),
    },
    redisPort: {
      value: process.env.REDIS_PORT,
      joi: Joi.number().default(6379),
    },
  };

  return JoiUtil.validate(configs);
});
