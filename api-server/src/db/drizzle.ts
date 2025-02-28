import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { Config } from '../config/env';

export const client = postgres(Config.DATABASE_URL, { prepare: false })
export const database = drizzle(client);