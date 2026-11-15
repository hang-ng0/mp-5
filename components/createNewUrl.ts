"use server";
import ShortUrl from "@/types";
import getCollection, {URL_COLLECTION} from "@/db";

export default async function createNewUrl(
    alias: string,
    url: string,
): Promise<ShortUrl> {
    console.log(`Creating new URL for ${alias}...`);

    //Cleaning the inputs
    const cleanAlias = alias.trim();
    const cleanUrl = url.trim();

    //making sure alias isn't empty
    if (!cleanAlias) {
        throw new Error("Need to enter an alias.")
    }

    //Validating the URL
    let parsedURL: URL;
    try{
        parsedURL = new URL(cleanUrl);
    } catch {
        throw new Error("Please enter a valid URL");
    }

    //connect to mongodb
    const urlCollections = await getCollection(URL_COLLECTION);

    //check whether the alias has been used
    const existingUrl = await urlCollections.findOne({ alias: cleanAlias });
    if (existingUrl) {
        throw new Error("This alias has already been used.");
    }

    const p = {
        alias: alias,
        origurl: parsedURL.toString(),
    }

    //insert into mongodb
    const res = await urlCollections.insertOne(p);

    if (!res.acknowledged){
        throw new Error("DB insert failed");
    }

    return {alias: p.alias, origurl: p.origurl};

}