// lib/mongodb.ts
import { MongoClient } from 'mongodb';
import { config } from '../app/config';

const uri = config.mongodb.uri;

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

// Use a global variable to preserve the connection across module reloads
let globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (!globalWithMongo._mongoClientPromise) {
  client = new MongoClient(uri, options);
  globalWithMongo._mongoClientPromise = client.connect();
}
clientPromise = globalWithMongo._mongoClientPromise!;

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be safely re-used across multiple
// functions.
export default clientPromise;
