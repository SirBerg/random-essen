import {apiTypes, frontend} from '@/types/index'
import PocketBase, {RecordModel} from "pocketbase";

/*
* Flow of creation:
* Request Received -> Create Ingredients -> Create Meal -> Get IDs from both and then fill in relation table
* */


export async function POST(request:Request){

    let requestBody:apiTypes.mealCreationRequest

    try{
        requestBody = await request.json()

        const ObjectKeys:string[] = Object.keys(requestBody)

        //validate top level scheme
        if(!ObjectKeys.includes("manifest" || "requestTime" || "body") ||
            //checking validty of types
            typeof requestBody.manifest != "boolean" ||
            typeof requestBody.requestTime != "string" ||
            typeof requestBody.body != "object"
        ){

            console.log('[API][APP][route.ts] Error whilst parsing Body at line 14 (Top-Level Parse Failed)')
            const returnObj:apiTypes.baseResponse = {
                "isError": true,
                "responseName": "Unsupported Media Type",
                "debug": "No or faulty body provided, this is an error with your request!"
            }

            return new Response(JSON.stringify(returnObj), {
                status: 415,
                headers:{
                    'berg-response-code': "Error",
                    'content-type': 'application/json'
                }
            })
        }

        //validate body scheme and types
        const bodyObjectKeys = Object.keys(requestBody.body)
        console.log(!bodyObjectKeys.includes("userIcon"))
        console.log(bodyObjectKeys)
        if(!bodyObjectKeys.includes("image" ||
            "name" ||
            "healthyOption" ||
            "image" ||
            "ingredients" ||
            "recipe" ||
            "userID" ||
            "userIcon" ||
            "persons"
            ) ||

            //checking validly of types
            typeof requestBody.body.name != "string" ||
            typeof requestBody.body.image != "string" ||
            typeof requestBody.body.recipe != "string" ||
            typeof requestBody.body.userID != "string" ||
            typeof requestBody.body.healthyOption != "string" ||
            typeof requestBody.body.persons != "number" ||
            !Array.isArray(requestBody.body.ingredients)
        ){

            console.log('[API][APP][route.ts] Error whilst parsing Body at line 45 - 62 (Creation Scheme Validation Failed)')
            const returnObj:apiTypes.baseResponse = {
                "isError": true,
                "responseName": "Unsupported Media Type",
                "debug": "No or faulty body provided, this is an error with your request! This is a problem with the Scheme of the creation request!"
            }

            return new Response(JSON.stringify(returnObj), {
                status: 415,
                headers:{
                    'berg-response-code': "Error",
                    'content-type': 'application/json'
                }
            })
        }
    }
    catch(e){
        console.log('[ERROR][API][APP][route.ts] Error whilst parsing JSON or validating Scheme: ', e)

        const responseObject:apiTypes.baseResponse = {
            isError: true,
            responseName: "Internal Server Error",
            debug: "empty string"
        }
        return new Response(JSON.stringify(responseObject), {
            status: 500,
            headers:{
                'berg-response-code': "Error",
                'content-type': 'application/json'
            }
        })
    }

    //authenticating PocketBase
    const pb = new PocketBase(process.env.POCKETBASE_HOST)
    //@ts-ignore
    const authData = await pb.admins.authWithPassword(process.env.POCKETBASE_USERNAME, process.env.POCKETBASE_PASSWORD)

    let createdIngredients: {"id":string, "amount":number}[] = []
    try{

        //creating ingredients
        for (const ingredient of requestBody.body.ingredients) {

            //validate scheme
            if(typeof ingredient != "object" || !Object.keys(ingredient).includes(
                "name" ||
                "unit" ||
                "amount" ||
                "healthyOption"
            ) || typeof ingredient.unit != "object"){
                console.log('[API][APP][route.ts] Line 114: Ingredient Top Level Validation Failed')
                const returnObj:apiTypes.baseResponse = {
                    "isError": true,
                    "responseName": "Unsupported Media Type",
                    "debug": "Faulty Ingredient Provided! This is a problem with the Scheme of the creation request!"
                }

                new Response(JSON.stringify(returnObj), {
                    status: 415,
                    headers: {
                        'berg-response-code': "Error",
                        'content-type': 'application/json'
                    }
                });
            }

            //validate unit scheme
            //only the ID really matters here
            if(!Object.keys(ingredient.unit).includes("id")){
                console.log('[API][APP][route.ts] Line 114: Ingredient Unit Validation Failed')
                const returnObj:apiTypes.baseResponse = {
                    "isError": true,
                    "responseName": "Unsupported Media Type",
                    "debug": "Faulty Unit Provided! This is a problem with the Scheme of the creation request!"
                }

                new Response(JSON.stringify(returnObj), {
                    status: 415,
                    headers: {
                        'berg-response-code': "Error",
                        'content-type': 'application/json'
                    }
                });
            }

            //create ingredient in database
            const data = {
                "name": ingredient.name,
                "healthyOption": ingredient.healthyOption,
                "creator": ingredient.creator,
                "unit": ingredient.unit.id,
            }
            const record:RecordModel = await pb.collection('Ingredients').create(data)
            console.log('[API][APP][route.ts] Created Ingredient with id', record.id)
            createdIngredients.push({
                "id":record.id,
                "amount":ingredient.amount

            })
        }
    }
    catch(e){
        console.log('[ERROR][APP][route.ts] Error whilst creating ingredients:', e)
        const responseObject:apiTypes.baseResponse = {
            isError: true,
            responseName: "Internal Server Error",
            debug: "empty string"
        }
        return new Response(JSON.stringify(responseObject), {
            status: 500,
            headers:{
                'berg-response-code': "Error",
                'content-type': 'application/json'
            }
        })
    }

    //id for inserting the Ingredient to Meal relations
    let createdMeal:string

    //create meal
    try{
        const data = {
            "name": requestBody.body.name,
            "image": requestBody.body.image,
            "healthyOption": requestBody.body.healthyOption,
            "creator": requestBody.body.userID,
            "recipe": requestBody.body.recipe,
            "persons": requestBody.body.persons,
            "creatorImage": requestBody.body.userIcon,
            "isApproved": false
        }

        const record:RecordModel = await pb.collection('Meals').create(data)
        console.log('[API][APP][route.ts] Created Meal with id', record.id)
        createdMeal = record.id
    }
    catch(e){
        console.log('[ERROR][APP][route.ts] Error whilst creating Meal:', e)
        const responseObject:apiTypes.baseResponse = {
            isError: true,
            responseName: "Internal Server Error",
            debug: "empty string"
        }
        return new Response(JSON.stringify(responseObject), {
            status: 500,
            headers:{
                'berg-response-code': "Error",
                'content-type': 'application/json'
            }
        })
    }

    //create relations between meal and ingredients
    try{

        //@ts-ignore
        for (const createdIngredient of createdIngredients) {
            const data = {
                "IngredientID": createdIngredient.id,
                // @ts-ignore
                "MealID": createdMeal,
                "amount": createdIngredient.amount
            }
            const record = await pb.collection('IngredientsMeals').create(data);
            console.log('[API][APP][route.ts] Created Meal-Ingredient Relation with id', record.id)
        }
    }
    catch(e){
        console.log('[ERROR][APP][route.ts] Error whilst creating Ingredient - Meals Relations:', e)
        const responseObject:apiTypes.baseResponse = {
            isError: true,
            responseName: "Internal Server Error",
            debug: "empty string"
        }
        return new Response(JSON.stringify(responseObject), {
            status: 500,
            headers:{
                'berg-response-code': "Error",
                'content-type': 'application/json'
            }
        })
    }

    const returnObject:apiTypes.baseResponse = {
        isError: false,
        responseName: "Created"
    }

    //clear authentication so we don't open unlimited auth states
    pb.authStore.clear()


    return new Response(JSON.stringify(returnObject), {
        status: 201,
        headers:{
            "content-type": "text/plain",
            "berg-status-code": "OK"
        }
    })
}