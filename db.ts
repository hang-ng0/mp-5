import { MongoClient, Db, Collection } from "mongodb";

const MONGO_URL = process.env.MONGO_URL as string;
if (!MONGO_URL) {
    throw new Error("MongoDB URL is missing");
}

const DB_NAME = "MP-5";
export const URL_COLLECTION = "URL";

let client: MongoClient | null = null;
let db: Db | null = null;

async function connect(): Promise<Db> {
    if (!client){
        client = new MongoClient(MONGO_URL);
        await client.connect();
    }
    return client.db(DB_NAME);
}

export default async function getCollection(
    collectionName: string,
): Promise<Collection> {
    if (!db){
        db = await connect();
    }
    return db.collection(collectionName);
}
