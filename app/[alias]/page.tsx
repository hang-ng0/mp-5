import {redirect, notFound} from "next/navigation";
import getCollection, {URL_COLLECTION} from "@/db";

export const dynamic = "force-dynamic"; //tells next.js to not prerender at build time so vercel can still deploy
// should only render when someone is visiting the page

//using dynamic routing to redirect to the specific page but need to pull the alias and origurl data from mongodb
export default async function AliasPage({params}: {params: Promise<{alias: string}>}) {
    //need params because this is a dynamic routing
    //taking the param which is the type in alias and using it to sort through the database to find the origurl
    //params: the variable containing the url information
    const {alias} = await params; //deconstructing to get the specific alias variable, same as const alias = user.alias
    const urlCollection = await getCollection(URL_COLLECTION);
    const savedUrl = await urlCollection.findOne({alias});
    if (!savedUrl) {
        notFound() //next.js will display a page not found response to indicate there's no data or url link to the alias
    }
    redirect(savedUrl.origurl); //going to the original url
}