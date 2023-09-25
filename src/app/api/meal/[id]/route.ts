
import {NextRequest} from "next/server";
import {apiTypes, ingredient, meal} from "@/types";
import PocketBase, {ListResult, RecordModel} from "pocketbase";
import {hexHash} from "next/dist/shared/lib/hash";
export async function GET(request:NextRequest, { params } : {params: { id: string}}){
    //handle edgecase if no param
    if(!params.id){
        console.log(`[ERROR][API][MEAL][:id][route.ts] No ID provided?? Idk how you would get here.`)
        const returnObject:apiTypes.baseResponse = {
            isError: true,
            responseName: "Request Error: No ID Provided, how da hell did you get here? Please report this on github"
        }
        return new Response(JSON.stringify(returnObject), {
            status: 400,
            headers: {
                "content-type": "application/json",
                "berg-response-code": "Error"
            }
        })
    }

    //check if id conforms to standard
    const hexRegexp = new RegExp("^[a-zA-Z0-9_.-]*$")
    if(!hexRegexp.test(params.id)){
        console.log(`[ERROR][API][MEAL][:id][route.ts] Faulty ID provided`)
        const returnObject:apiTypes.baseResponse = {
            isError: true,
            responseName: "Only numbers or alphabetical characters allowed in ID"
        }
        return new Response(JSON.stringify(returnObject), {
            status: 400,
            headers: {
                "content-type": "application/json",
                "berg-response-code": "Error"
            }
        })
    }

    try{

        //authenticate pocket-base
        const pb:PocketBase = new PocketBase(process.env.POCKETBASE_HOST)

        //@ts-ignore
        const authData = await pb.admins.authWithPassword(process.env.POCKETBASE_USERNAME, process.env.POCKETBASE_PASSWORD)




        const meal:meal = await pb.collection("Meals").getOne(params.id)
        const ingredients:RecordModel[] = await pb.collection('IngredientsMeals').getFullList({
            filter: `MealID = "${params.id}"`,
            expand: 'IngredientID.unit'
        })

        const returnObject:apiTypes.mealDetailResponseObject = {
            isError: false,
            responseName: "Success",
            body:{
                meal: meal,

                //@ts-ignore
                ingredients: ingredients
            }
        }

        //clear authentication so we don't open unlimited auth states
        pb.authStore.clear()

        //return object
        return new Response(JSON.stringify(returnObject), {
            "status":200,
            "headers":{
                "content-type":"application/json"
            }
        })
    }
    catch(e){
        console.log(`[ERROR][API][MEAL][${params.id}][route.ts] Error whilst fetching and returning Meal: `, e)
        const returnObject:apiTypes.baseResponse = {
            isError: true,
            responseName: "Request Error: Error whilst fetching Meal! My fault, please report this on github."
        }
        return new Response(JSON.stringify(returnObject), {
            status: 500,
            headers: {
                "content-type": "application/json",
                "berg-response-code": "Error"
            }
        })
    }
}