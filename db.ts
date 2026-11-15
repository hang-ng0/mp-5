import { MongoClient, Db, Collection } from "mongodb";

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
    throw new Error("MongoDB URL is missing");
}

const DB_NAME = "MP-5";
export const URL_COLLECTION = "URL";

//vercel deployment didn't work with how mongodb was connecting before (such as how it was connecting in discussion)
//needed to store the reference of mongodb client to its connection promise in globalThis isntead of storing it as a regular variable
//next.js can reload modules and execute code in different ways during deployment
//so the global reference preserve the connection across those module reloads
// when deploy to vercel, module are reloaded and evaluated in different way so multiple instances may each need their own mongodb connection
const globalForMongo = globalThis as typeof globalThis & {
    mongoClientPromise?: Promise<MongoClient>;
};

if (!globalForMongo.mongoClientPromise) {
    const client = new MongoClient(MONGO_URL);
    globalForMongo.mongoClientPromise = client.connect();
}

const clientPromise = globalForMongo.mongoClientPromise;

//this is accessing the stored connection
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
