import * as Joi from 'joi';
import { Schema, SchemaMap } from 'joi';

type ConfigProps = {
  value: unknown;
  joi: Schema;
};

export type JoiConfig<T> = Record<keyof T, ConfigProps>;

export default class JoiUtil {
  static validate<T>(config: JoiConfig<T>): T {
    const schemaObj = JoiUtil.extractByPropName(config, 'joi') as SchemaMap<T>;
    const schema = Joi.object(schemaObj);
    const values = JoiUtil.extractByPropName(config, 'value') as T;

    const { error, value } = schema.validate(values, { abortEarly: false });
    if (error) {
      throw new Error(
        `Environment variable validation falied, check for missing enviorment variables ${error.message}`,
      );
    }

    return value;
  }

  static extractByPropName<T>(
    config: JoiConfig<T>,
    propName: keyof ConfigProps,
  ): T | SchemaMap<T> {
    const arr: {
      [key: string]: unknown | Schema;
    }[] = Object.keys(config).map((key) => {
      return {
        [key]: config[key as keyof T][propName],
      };
    });

    return Object.assign({}, ...arr);
  }
}
