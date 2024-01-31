import { config as load } from 'dotenv';

load();

export const config = {
  database: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: Number.parseInt(process.env.DATABASE_PORT ?? '5432'),
    user: process.env.DATABASE_USERNAME ?? 'flipper',
    name: process.env.DATABASE_NAME ?? 'burguer',
    pass: process.env.DATABASE_PASSWORD ?? 'postgres',
  },
};

export type Config = typeof config;
