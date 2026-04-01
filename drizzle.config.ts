import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './drizzle/schema.drizzle.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
