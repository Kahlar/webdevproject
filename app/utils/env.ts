import { z } from 'zod';

// Define the schema for environment variables
const envSchema = z.object({
  // MongoDB Configuration
  MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
  MONGODB_DB: z.string().default('greensphere'),

  // API Configuration
  API_RATE_LIMIT: z.string().transform(Number).default('100'),
});

// Function to get environment variables from different sources
function getEnvVar(key: keyof z.infer<typeof envSchema>): string | undefined {
  // 1. Check Vercel environment variables
  if (process.env.VERCEL) {
    const value = process.env[key];
    if (value) return value;
  }

  // 2. Check GitHub environment variables
  if (process.env.GITHUB_ACTIONS) {
    const value = process.env[key];
    if (value) return value;
  }

  // 3. Check .env.local file
  const value = process.env[key];
  if (value) return value;

  return undefined;
}

// Function to validate and parse environment variables
export function validateEnv() {
  const envVars = {
    MONGODB_URI: getEnvVar('MONGODB_URI'),
    MONGODB_DB: getEnvVar('MONGODB_DB'),
    API_RATE_LIMIT: getEnvVar('API_RATE_LIMIT'),
  };

  try {
    const validatedEnv = envSchema.parse(envVars);
    return validatedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.')).join(', ');
      throw new Error(`Missing or invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
}

// Export validated environment variables
export const env = validateEnv(); 