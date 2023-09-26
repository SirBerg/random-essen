'use client'

import {Box, Button, Center, Grid, GridItem, Icon, Stack} from "@chakra-ui/react";
import {IconButton} from "@/components/ui/button";
import {SearchIcon} from '@chakra-ui/icons'
import SearchBar from "@/components/search/Bar";
import { useRouter } from 'next/navigation'
import {
    SignedIn,
    SignedOut, SignIn,
    SignInButton,
    UserButton
} from "@clerk/nextjs";
import {motion} from "framer-motion";
import Link from "next/link";

export default function Header(){
    const router = useRouter()
    async function handleClick(element:string){
        if(element === "Editor"){
            router.push('/app?selected=Editor')
        }
        else if(element === "List"){
            router.push('/app?selected=List')
        }
        else if(element === "Home"){
            router.push('/')
        }
    }

    return(
        <div>
            <Grid className="header" templateColumns="repeat(3, 1fr)" gap={6}>
                <GridItem>
                    <Button variant="unstiled" onClick={()=>handleClick("Home")}>
                        random-essen
                    </Button>
                </GridItem>
                <GridItem>
                    <Center>
                        {/*<SearchBar/>*/}
                    </Center>
                </GridItem>
                <GridItem>
                    <div className="float-right" style={{marginRight: "10px"}}>
                            <SignedIn>
                                <Stack direction="row">
                                    <Button onClick={()=>handleClick("List")}>
                                        My Meals
                                    </Button>
                                    <Button onClick={()=>handleClick("Editor")}>
                                        Editor
                                    </Button>
                                    <Center>
                                        <UserButton />
                                    </Center>
                                </Stack>
                            </SignedIn>
                            <SignedOut>
                                    <Box
                                        as={motion.div}
                                        initial={{opacity:0, y:-25}}
                                        animate={{opacity:1, y:0}}
                                    >
                                        <Button colorScheme="purple">
                                            <SignInButton />
                                        </Button>
                                    </Box>
                            </SignedOut>
                    </div>
                </GridItem>
            </Grid>
        </div>
    )
}