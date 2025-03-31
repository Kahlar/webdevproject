import { MongoClient } from 'mongodb';
import { config } from '../config';

const uri = config.mongodb.uri;
const dbName = config.mongodb.dbName;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Use a global variable to preserve the connection across module reloads
let globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (!globalWithMongo._mongoClientPromise) {
  client = new MongoClient(uri);
  globalWithMongo._mongoClientPromise = client.connect();
}
clientPromise = globalWithMongo._mongoClientPromise;

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db(dbName);
  return { client, db };
}

// Export a module-scoped MongoClient promise
export default clientPromise;

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
    return client.db(dbName);
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