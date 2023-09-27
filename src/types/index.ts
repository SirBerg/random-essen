export type updateActionType = "update" | "add" | "delete"
export type updatePathType = "includedIngredients" | "includedMeals" | "includedHealthyOptions" | "count" | "includeRepeats"


export type meal = {
    "created": Date,
    "collectionName": string,
    "collectionId": Date,
    "healthyOption": filterNames,
    "id": string,
    "image": string,
    "name": string,
    "recipe": string,
    "updated": Date,
    "creator": string,
    "creatorIcon": string,
    "isApproved": boolean,
    "isDiscoverable": boolean,
    "creatorName":string,
    "persons": number
}

export type mealSummary = {
    "id":string,
    "name":string,
    "updated":Date,
    "created":Date,
    "image":string,
    "healthyOption":filterNames
}

export type ingredient = {
    "id": string,
    "collectionId": string,
    "created": string,
    "updated": string,
    "name": string,
    "unit": string,
    "healthyOption": filterNames,
    "unitShorthand":string,
}

export type unit = {
    name: 'gram' | 'kilogram' | 'milligram' | 'liter' | 'milliliter' | 'pieces',
    shorthand: 'g' | 'kg' | 'mg' | 'l' | 'ml' | 'pcs',
    id: string,
    created: Date,
    collectionName: string,
    collectionId: string,
    updated: Date,
}

export namespace frontend {
    export type ingredient = {
        name: string,
        unit: unit,
        amount: number,
        healthyOption: filterNames,
        creator: string
    }
}

export type manifestIngredient = {
    "name": string,
    "healthyOption": "vegan" | "vegetarian" | "meat" | "all"
    "unit": string
}


export type filterNames = "vegan" | "vegetarian" | "all" | "meat"
export type markdownString = string

export namespace apiTypes {


    /*
    *
    * Base Scheme every API request must follow
    * */
    export type baseRequest = {

        //set to true if you are requesting re-transmition of manifest from api endpoint
        manifest: boolean,
        requestTime: Date,
        //
    }

    export interface randomizeRequest extends baseRequest{
        filter: {
            includedHealthyOption: filterNames,
        }
    }
    export type baseResponse = {
        isError: boolean,
        responseName: string,
        //if there is an error this will be populated
        debug?: string
    }
    export interface randomizeResponse extends baseResponse{
        body: {
            returnArray: meal[]
        }
    }

    export interface unitManifestResponse extends baseResponse{
        body: unit[]
    }


    export interface ingredientCreationRequest extends baseRequest{
        body:{
            "name":string,
            "unit": string
        }
    }

    export interface mealCreationRequest extends baseRequest{
        body:{
            "name":string,
            "healthyOption":filterNames,

            //the image is supposed to be a URI as the Image is uploaded seperate from the endpoint
            "image": string,

            //only IDs should be passed to the endpoint
            "ingredients": frontend.ingredient[]
            "recipe": markdownString,
            "userID": string,
            "userName": string,
            "userIcon":string,
            "persons": number,
        }
    }

    export interface uploadResponse extends baseResponse {
        filePath:string,
    }

    export interface createdByMeResponse extends baseResponse {
        body:meal[]
    }

    export interface mealDetailResponseObject extends baseResponse {
        body:{
            meal: meal,
            ingredients:[{
                IngredientID: string,
                MealID: string,
                amount: number,
                collectionName: string,
                created: Date,
                expand: {
                    IngredientID:{
                        collectionId: string,
                        collectionName: "Ingredients",
                        created: Date,
                        creator: string,
                        expand: {
                            unit:unit
                        },
                        healthyOption: string,
                        id: string,
                        name: string,
                        unit: string,
                        updated:Date
                    }
                }
            }]
        }
    }
}


export type manifest = {
    paths: {
        ingredients: string
    }
}

export type ingredientManifest = {
    ingredients: manifestIngredient[]
}