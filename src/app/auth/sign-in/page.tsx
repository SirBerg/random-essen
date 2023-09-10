import { SignIn } from "@clerk/nextjs";
import { Center } from "@chakra-ui/react";

export default function Page() {
    return (
        <Center className="full-screen">
            <SignIn />
        </Center>
    )
}