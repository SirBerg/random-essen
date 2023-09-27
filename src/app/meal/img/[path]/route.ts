import {NextRequest} from "next/server";
import {useSearchParams} from "next/navigation";
import {join} from "path";
import * as fs from "fs";
import path from "path"
import {stat} from "fs";
import {apiTypes} from "@/types";
export async function GET(request:NextRequest, { params } : {params: { path: string}}){
    const searchParams = request.nextUrl.searchParams

    if(!searchParams.get('fileName') || !params?.path){
        const returnObj:apiTypes.baseResponse = {
            "isError":true,
            "responseName": "Bad request!"
        }
        return new Response(JSON.stringify(returnObj), {
            status: 400,
            headers:{
                "Content-Type": "application/json",
            }
        })
    }
    let filePath = path.resolve('.', `public/meal/${params.path}/${searchParams.get('fileName')}`)
    let stat, imageBuffer

    //get image data and set to buffer
    try{
        stat = fs.statSync(filePath)
        imageBuffer = fs.readFileSync(filePath)
    }
    catch(e){
        console.log('File prob. not found')
        const returnObj:apiTypes.baseResponse = {
            "isError":true,
            "responseName": "File not found!"
        }
        return new Response(JSON.stringify(returnObj), {
            status: 404,
            headers:{
                "Content-Type": "application/json",
            }
        })
    }
    return new Response (imageBuffer,
        {
            status: 200,
            headers:{
                'Content-Type': `Image/${searchParams.get('fileName').split('.').pop()}`,
                'Content-Length': stat.size
            }
    })
}