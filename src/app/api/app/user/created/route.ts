//TODO: Implement type checking and error handling

import { getAuth } from "@clerk/nextjs/server";
import PocketBase, {ListResult} from "pocketbase";
import { NextRequest } from "next/server";
import {apiTypes, meal} from "@/types";
export async function GET(request:NextRequest){
    const {userId} = getAuth(request)

    try{
        //authenticating PocketBase
        const pb = new PocketBase(process.env.POCKETBASE_HOST)

        //@ts-ignore
        const authData = await pb.admins.authWithPassword(process.env.POCKETBASE_USERNAME, process.env.POCKETBASE_PASSWORD)

        let page:number = 1
        if(request.nextUrl.searchParams.get('page') && request.nextUrl.searchParams.get('page')){
            //@ts-ignore
            page = parseInt(request.nextUrl.searchParams.get('page'))

            if(page && page < 1){
                page = 1
            }
        }

        //@ts-ignore
        let filter = `creator = '${userId.toString()}'`
        const resultList:ListResult<meal> = await pb.collection('Meals').getList(page, 50, {
            filter: filter
        })

        let responseObject:apiTypes.createdByMeResponse = {
            "isError":false,
            "responseName": "Success",
            "body":resultList.items
        }

        return new Response(JSON.stringify(responseObject), {
            status: 200,
            headers:{
                "content-type":"application/json",
                'berg-response-code': "OK",
            }
        })
    }
    catch(e){
        console.log('[ERROR][APP][USER][CREATED][route.ts] Error whilst fetching Meals created by User:', e)
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

}