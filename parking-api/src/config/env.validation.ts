import Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),

  // PostgreSQL
  PG_HOST: Joi.string().required(),
  PG_PORT: Joi.number().default(5432),
  PG_USER: Joi.string().required(),
  PG_PASSWORD: Joi.string().required(),
  PG_DB: Joi.string().required(),

  // MongoDB
  MONGO_URI: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
});
