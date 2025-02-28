import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { Config } from './src/config/env';

config({ path: '.env' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: Config.DATABASE_URL!,
  },
});
