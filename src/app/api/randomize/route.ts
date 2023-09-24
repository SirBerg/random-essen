import * as types from '@/types/index'
import PocketBase, {ListResult, RecordModel} from 'pocketbase'


export async function POST(request: Request){
    type filterTypes = {
        'all':string,
        'meat': string
        'vegetarian': string,
        'vegan':string
    }
    const filter = {
        //this means everything will be included (meat, vegetarian, vegan)
        'all': '',
        'meat': '',
        //it's "all" because some things like pizza or pancakes can be done vegetarian or vegan style, "all" refers to these meals
        'vegetarian': 'healthyOption = "vegetarian" || healthyOption = "all" || healthyOption = "vegan"',
        'vegan' : 'healthyOption = "vegan" || healthyOption = "all"'
    }


    //parsing and validating request body
    let requestBody:types.apiTypes.randomizeRequest
    try{
        if(request.body){
            requestBody = await request.json()
        }
        else{
            console.log('[API][RANDOMIZE][route.ts] No Request Body provided')
            throw new Error('No Request Body provided!')
        }
        //validate scheme
        if(!Object.keys(requestBody).includes("manifest") || !Object.keys(requestBody).includes("requestTime") || !Object.keys(requestBody).includes("filter") || !Object.keys(requestBody.filter).includes('includedHealthyOption')){

            console.log('[API][RANDOMIZE][route.ts] Wrong Body Scheme')
            throw new Error('Faulty Body provided')
        }

        //validate if healthy option is correct
        const filterOptions:string[] = [
            "all",
            "meat",
            "vegetarian",
            "vegan"
        ]

        if(!filterOptions.includes(requestBody.filter.includedHealthyOption)){
            console.log('[API][RANDOMIZE][route.ts] HealthyOption Incorrect')
            throw new Error('Faulty Healthy Option')
        }
    }
    catch(e:any){
        console.log('[API][RANDOMIZE][route.ts] Error whilst parsing Body at line 27 (Most likely malformed request)')
        const returnObj:types.apiTypes.baseResponse = {
            "isError": true,
            "responseName": "Unsupported Media Type",
            "debug": "No or faulty body provided, this is an error with your request! Also: Check the HealthyOption!"
        }
        return new Response(JSON.stringify(returnObj), {
            status: 415,
            headers:{
                'berg-response-code': "Error",
                'content-type': 'application/json'
            }
        })
    }

    const pb = new PocketBase(process.env.POCKETBASE_HOST)

    //@ts-ignore
    const authData = await pb.admins.authWithPassword(process.env.POCKETBASE_USERNAME, process.env.POCKETBASE_PASSWORD)
    const records:ListResult<RecordModel> = await pb.collection("Meals").getList(1, 7, {
        sort: '@random',
        filter: filter[requestBody.filter.includedHealthyOption]
    })

    //clear authentication so we don't open unlimited auth states
    pb.authStore.clear()
    const returnObj:types.apiTypes.randomizeResponse = {
        "isError": false,
        "responseName": "OK",
        body:{
            //@ts-ignore
            returnArray: records.items
        }
    }
    return new Response(JSON.stringify(returnObj), {
        status: 200,
        headers:{
            'berg-response-code': "OK",
            'content-type': 'application/json'
        }
    })
}

//as this is a public endpoint, this should be here to serve as docs
export async function OPTIONS(request: Request){
    return new Response('', {
        status: 200,
        headers:{
            'berg-response-code': "OK",
            'Allow': 'OPTIONS, HEAD, POST'
        }
    })
}


export async function HEAD(request: Request){

    return new Response('', {
        status: 200,
        headers: {
            'berg-response-code': "OK",
            'content-type': 'application/json'
        },
    })
}