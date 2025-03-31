import { z } from 'zod';

// Define the schema for environment variables
const envSchema = z.object({
  // MongoDB Configuration
  MONGODB_URI: z.string().min(1, 'MongoDB URI is required').optional(),
  MONGODB_DB: z.string().default('greensphere'),
});

// Function to validate and parse environment variables
export function validateEnv() {
  const envVars = {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB,
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

// Temporary empty environment validation for deployment
export const env = {
  MONGODB_URI: "mongodb+srv://aishiktokdarxyz:ABCDE@reactproj.tdyf5.mongodb.net/?retryWrites=true&w=majority&appName=ReactProj",
  MONGODB_DB: "greensphere"
}; 