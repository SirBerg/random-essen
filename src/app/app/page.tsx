'use client'
import {Box} from "@chakra-ui/react";
import {useEffect} from "react";
import {useSearchParams} from "next/navigation";
import Editor from "@/components/ui/app/editor";
export default function Handler(){
    //const
    return(
        <Box maxWidth="100vw" overflow="hidden">
            <Editor />
        </Box>
    )
}