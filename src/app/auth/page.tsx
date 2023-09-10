'use client'
import {
    SignedIn,
    SignedOut, SignIn,
    SignInButton,
    UserButton
} from "@clerk/nextjs";
import {Box} from "@chakra-ui/react";
import {useEffect} from "react";
import {useRouter} from 'next/router'
export default function Handler(){
    useEffect(() => {
        const router = useRouter()
        router.push('/')
    }, []);
    return(
        <Box>

        </Box>
    )
}