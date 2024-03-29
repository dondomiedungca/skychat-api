import * as Joi from 'joi';

export default Joi.object({
  APP_URL: Joi.string(),
  EXPO_ACCESS_TOKEN: Joi.string(),
  APP_TITLE: Joi.string(),
  environment: Joi.string().required(),
  PORT: Joi.number().min(1000).max(9999).required(),
  token: {
    saltRound: Joi.number().min(1).max(10).required(),
    exp: Joi.object({
      access: Joi.object({
        months: Joi.number().required(),
        days: Joi.number().required(),
        hours: Joi.number().required(),
        minutes: Joi.number().required(),
        seconds: Joi.number(),
      }),
      refresh: Joi.object({
        months: Joi.number().required(),
        days: Joi.number().required(),
        hours: Joi.number().required(),
        minutes: Joi.number().required(),
        seconds: Joi.number(),
      }),
    }),
  },
  mail: {
    port: Joi.number().required(),
    host: Joi.string().required(),
    secure: Joi.boolean().required(),
    from: Joi.string().required(),
    auth: {
      user: Joi.string().required(),
      pass: Joi.string().required(),
    },
  },
  database: {
    type: Joi.string().required(),
    host: Joi.string().required(),
    port: Joi.number().min(1000).max(9999).required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    database: Joi.string().required(),
    entities: Joi.array().required(),
    synchronize: Joi.boolean().required(),
  },
});
