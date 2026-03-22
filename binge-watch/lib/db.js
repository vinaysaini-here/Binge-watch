import "server-only";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "binge-watch";

let clientPromise;

function createClient() {
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const client = new MongoClient(uri);
  return client.connect();
}

export async function getDatabase() {
  clientPromise ||= createClient();
  const client = await clientPromise;
  return client.db(dbName);
}

export { ObjectId };
