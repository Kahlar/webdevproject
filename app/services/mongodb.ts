import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect().then(client => {
      console.log('✅ MongoDB Connected Successfully');
      console.log(`📁 Connected to database: ${client.db().databaseName}`);
      return client;
    }).catch(error => {
      console.error('❌ MongoDB Connection Error:', error);
      throw error;
    });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect().then(client => {
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📁 Connected to database: ${client.db().databaseName}`);
    return client;
  }).catch(error => {
    console.error('❌ MongoDB Connection Error:', error);
    throw error;
  });
}

export default clientPromise;

// Helper function to get the database instance
export async function getDb() {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || 'greensphere');
}

// Helper function to get a collection
export async function getCollection(name: string) {
  const db = await getDb();
  const collection = db.collection(name);
  console.log(`📊 Accessed collection: ${name}`);
  return collection;
} 