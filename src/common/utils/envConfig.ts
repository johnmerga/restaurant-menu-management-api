import { cleanEnv, str, num, bool, url } from 'envalid';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Validate environment variables
export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  PORT: num({ default: 3000 }),
  DB_HOST: str(),
  DB_PORT: num(),
  DB_USER: str(),
  DB_PASS: str(),
  DB_NAME: str(),
  JWT_SECRET: str(),
  JWT_EXPIRES_IN: str({ default: '1h' }),
  ENABLE_SWAGGER: bool({ default: false }),
  API_BASE_URL: url({ default: 'http://localhost:3000' }),
});
