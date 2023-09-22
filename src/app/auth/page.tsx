import {
    SignedIn,
    SignedOut, SignIn,
    SignInButton,
    UserButton
} from "@clerk/nextjs";
import {Box} from "@chakra-ui/react";
import {redirect} from "next/navigation";

export default function Handler(){
    redirect('/')
    return(
        <Box>

        </Box>
    )
}