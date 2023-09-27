import {writeFile} from "fs/promises";
import {NextResponse} from "next/server";
import {join} from "path";
import {apiTypes} from "@/types";
import {mkdir} from "fs";
import randomHex from "@/functions/generateRandomHex";

export async function POST(request:Request){
    try{
        const data:FormData = await request.formData()
        const file:File | null = data.get('file') as any as File

        //handle edge case where no file or ID is given
        if(!file || !data.get('id')){
            console.log('[API][APP][UPLOAD][route.ts] Aborting Upload due to either no file or no id')
            const responseObject:apiTypes.baseResponse = {
                "isError": true,
                "responseName":"Request Error: Your Request did not match the scheme!",
                "debug": "No file Provided!",
            }
            return new Response(JSON.stringify(responseObject), {
                "status": 415,
                "headers":{
                    "content-type":"application/json",
                    "berg-response-code":"Error"
                }
            })
        }

        //@ts-ignore
        let id:string | null = data.get('id')

        //this means there is no public directory yet for this meal
        if(data.get('id') && data.get('id') == "not-yet-known"){

            //generate hex and then create directory
            id = randomHex(32)
            const path = join('',`public/meals/${id}`)
            mkdir(path, (err:any)=>{
                if(err){

                    throw new Error(err)
                }
                else{
                    console.log('[API][APP][UPLOAD][route.ts] Created Directory at', path)
                }
            })
        }

        //convert to buffer
        const bytes:ArrayBuffer = await file.arrayBuffer()
        const buffer:Buffer = Buffer.from(bytes)

        //generate id for file
        const generatedRandomFileName:string = randomHex(10)
        const extension:string | undefined = file.name.split('.').pop()

        //generate the path of the file
        const path = join('',`public/meal/${id}/${generatedRandomFileName}.${extension}`)

        //write to disk
        await writeFile(path, buffer)

        //respond to request
        console.log('[API][APP][UPLOAD][route.ts] Wrote File with ID:', generatedRandomFileName, 'to Disk')
        const responseObject:apiTypes.uploadResponse = {
            "isError":false,
            "responseName":"Created",
            "filePath":`/${path.replace(/\\/g, "/").replace("public/", "")}`
        }

        return new Response(JSON.stringify(responseObject), {
            "status": 201,
            "headers":{
                "content-type":"application/json",
                "berg-response-code":"Error"
            }
        })
    }
    catch(e){
        console.log("[ERROR][API][APP][UPLOAD][route.ts] Error whilst uploading File:", e)
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