export type updateActionType = "update" | "add" | "delete"
export type updatePathType = "includedIngredients" | "includedMeals" | "includedHealthyOptions" | "count" | "includeRepeats"


export type meal = {
    "creationDate": Date,
    "creator": string,
    "lastUpdated": Date,

}

export type manifestIngredient = {
    "name": string,
    "healthyOption": "vegan" | "vegetarian" | "meat"
    "unit": string
}

export type filterNames = "vegan" | "vegetarian" | "all"
export type excludedIngredient = string

export namespace apiTypes {


    /*
    *
    * Base Scheme every API request must follow
    * */
    export type baseRequest = {

        //set to true if you are requesting retransmition of manifest from api endpoint
        manifest: boolean,
        requestTime: Date,
        //
    }

    export interface randomizeRequest extends baseRequest{
        filter: {
            includedHealthyOptions: filterNames,
        }
    }
    export type baseResponse = {
        isError: boolean,
        debug?: string
    }
    export interface randomizeResponse extends baseResponse{
        body: {
            returnArray: meal[]
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