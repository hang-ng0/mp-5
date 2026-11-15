import { MongoClient, Db, Collection } from "mongodb";

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
    throw new Error("MongoDB URL is missing");
}

const DB_NAME = "MP-5";
export const URL_COLLECTION = "URL";

const globalForMongo = globalThis as typeof globalThis & {
    mongoClientPromise?: Promise<MongoClient>;
};

if (!globalForMongo.mongoClientPromise) {
    const client = new MongoClient(MONGO_URL);
    globalForMongo.mongoClientPromise = client.connect();
}

const clientPromise = globalForMongo.mongoClientPromise;

export default async function getCollection(
    collectionName: string,
): Promise <Collection> {
    const client = await clientPromise;
    const db: Db = client.db(DB_NAME);
    return db.collection(collectionName);
}

//
// let client: MongoClient | null = null;
// let db: Db | null = null;
//
// async function connect(): Promise<Db> {
//     if (!client){
//         client = new MongoClient(MONGO_URL);
//         await client.connect();
//     }
//     return client.db(DB_NAME);
// }
//
// export default async function getCollection(
//     collectionName: string,
// ): Promise<Collection> {
//     if (!db){
//         db = await connect();
//     }
//     return db.collection(collectionName);
// }
