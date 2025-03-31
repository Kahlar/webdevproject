import { MongoClient } from 'mongodb';
import { env } from '../utils/env';

const uri = env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  retryReads: true,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;
let isConnecting = false;
let retryCount = 0;
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 60000; // 1 minute

async function connectWithRetry(): Promise<MongoClient> {
  if (isConnecting) {
    return clientPromise;
  }

  isConnecting = true;
  client = new MongoClient(uri, options);

  try {
    const connectedClient = await client.connect();
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📁 Connected to database: ${connectedClient.db().databaseName}`);
    retryCount = 0;
    isConnecting = false;
    return connectedClient;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    isConnecting = false;

    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`🔄 Retrying connection (${retryCount}/${MAX_RETRIES}) in ${RETRY_INTERVAL/1000} seconds...`);
      
      // Wait for the retry interval
      await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
      
      // Try connecting again
      return connectWithRetry();
    } else {
      console.error('❌ Max retry attempts reached. Please check your MongoDB connection.');
      throw new Error('Failed to connect to MongoDB after maximum retry attempts');
    }
  }
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = connectWithRetry();
  }
  clientPromise = globalWithMongo._mongoClientPromise!;
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = connectWithRetry();
}

// Handle process termination
process.on('SIGINT', async () => {
  try {
    const client = await clientPromise;
    await client.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

// Health check function
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const client = await clientPromise;
    await client.db().command({ ping: 1 });
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Helper function to get the database instance with retry
export async function getDb() {
  try {
    const client = await clientPromise;
    return client.db(env.MONGODB_DB);
  } catch (error) {
    console.error('Error getting database instance:', error);
    throw error;
  }
}

// Helper function to get a collection with retry
export async function getCollection(name: string) {
  try {
    const db = await getDb();
    const collection = db.collection(name);
    console.log(`📊 Accessed collection: ${name}`);
    return collection;
  } catch (error) {
    console.error(`Error accessing collection ${name}:`, error);
    throw error;
  }
}

// Export the connection promise for external use
export default clientPromise; 