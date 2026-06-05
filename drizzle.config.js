import 'dotenv/config';
import { neonConfig } from '@neondatabase/serverless';

if (process.env.NEON_LOCAL === 'true') {
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineConnect = false;
}

export default {
  schema: './src/models/*.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url : process.env.DATABASE_URL,
  }
};