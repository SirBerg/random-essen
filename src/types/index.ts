export type meal = {
    "creationDate": Date,
    "creator": string,
    "lastUpdated": Date,

}

export type filterNames = "vegan" | "vegetarian" | "meat"
export type excludedIngredient = string

export type filterObject = {
    healthyOption: filterNames,
    excludedIngredients: excludedIngredient[],
    requiredIngredients: string[]
}

export namespace apiTypes {
    export type randomizeRequest = {
        filter: {

        }
    }
    export type baseRequest = {
        isError: boolean,
        debug?: string
    }
    export interface randomizeResponse extends baseRequest{
        body: {
            returnArray: meal[]
        }
    }
}