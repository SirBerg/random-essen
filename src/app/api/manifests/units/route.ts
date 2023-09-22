import PocketBase, {ListResult, RecordModel} from 'pocketbase'
import * as types from "@/types/index";

export async function GET(){
    try{
        const pb = new PocketBase('http://127.0.0.1:8090')

        //@ts-ignore
        const authData = await pb.admins.authWithPassword(process.env.POCKETBASE_USERNAME, process.env.POCKETBASE_PASSWORD)
        const records:RecordModel[] = await pb.collection('Units').getFullList({
            sort: '-created',
        });
        pb.authStore.clear()

        const responseObject:types.apiTypes.unitManifestResponse = {
            "isError": false,
            "responseName": "OK",

            //@ts-ignore
            "body": records
        }

        return new Response(JSON.stringify(responseObject), {
            headers:{
                'content-type':'application/json'
            }
        })
    }
    catch(e){
        console.log('ERROR IN ROUTE')
        const responseObject:types.apiTypes.baseResponse = {
            "isError": true,
            "responseName": "Internal Server Error",
            "debug": "Something happened... it's not you it's me. Sorry about that!"
        }
        return new Response(JSON.stringify(responseObject), {
            status: 500,
            headers:{
                'content-type': 'application/json',
                'berg-status-code': 'Error'
            }
        })
    }

}