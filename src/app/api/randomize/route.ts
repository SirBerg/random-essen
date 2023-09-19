import { NextResponse } from 'next/server'
import * as types from '@/types/index'
export async function POST(request: Request){
    const array:types.meal = [
        {

        }
    ]
}

export async function HEAD(request: Request){

    return new Response('Hello World!', {
        status: 200,
        headers: {
            'berg-response-code': "OK",
            'content-type': 'application/json'
        },
    })
}