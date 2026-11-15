"use server";
import ShortUrl from "@/types";
import getCollection, {URL_COLLECTION} from "@/db";

type urlResult = {
    success: boolean;
    message?: string;
    data?: ShortUrl; //adding the ? so it's not necessary for return to have the value
}

export default async function createNewUrl(
    alias: string,
    url: string,
): Promise<urlResult> {
    console.log(`Creating new URL for ${alias}...`);

    //Cleaning the inputs
    const cleanAlias = alias.trim();
    const cleanUrl = url.trim();

    //making sure alias isn't empty
    if (!cleanAlias) {
        return{
            success: false,
            message: "Please enter an alias."
        }
    }

    //Validating the URL
    let parsedURL: URL;
    try{
        parsedURL = new URL(cleanUrl);
    } catch {
        return{
            success: false,
            message: "Please enter a valid URL.",
        };
    }

    try{

        //connect to mongodb
        const urlCollections = await getCollection(URL_COLLECTION);

        //check whether the alias has been used
        const existingUrl = await urlCollections.findOne({ alias: cleanAlias });
        if (existingUrl) {
            return{
                success: false,
                message: "This alias has already been used.",
            }
        }

        const p = {
            alias: alias,
            origurl: parsedURL.toString(),
        };

        //insert into mongodb
        const res = await urlCollections.insertOne(p);

        if (!res.acknowledged){
            return{
                success: false,
                message: "Database insert failed.",
            }
        }

        return {success: true, data: p,};

    } catch(error){
        return{
            success: false,
            message: "Something went wrong and we couldn't create a new URL.",
        }
    }

}