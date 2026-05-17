import dotenv from 'dotenv';
import path from 'path';

// Load environmental parameters (looking up parent dirs if needed)
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env.local') });
dotenv.config();

export const config = {
  port: parseInt(process.env.BACKEND_PORT || '5000', 10),
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development'
};

// Check if Gemini API key exists
if (!config.geminiApiKey) {
  console.warn(`[LexGuard Config] Warning: GEMINI_API_KEY is not defined. The backend will invoke dynamic mock auditing fallback for custom texts.`);
} else {
  console.log(`[LexGuard Config] Success: GEMINI_API_KEY detected in config environment.`);
}
