'use client'

import {Button, Center, Grid, GridItem, Icon, Stack} from "@chakra-ui/react";
import {IconButton} from "@/components/ui/button";
import {SearchIcon} from '@chakra-ui/icons'
import SearchBar from "@/components/search/Bar";

import {
    SignedIn,
    SignedOut, SignIn,
    SignInButton,
    UserButton
} from "@clerk/nextjs";

export default function Header(){

    return(
        <div>
            <Grid className="header" templateColumns="repeat(3, 1fr)" gap={6}>
                <GridItem>
                    <Button variant="unstiled" as="a" href="/">
                        random-essen
                    </Button>
                </GridItem>
                <GridItem>
                    <Center>
                        <SearchBar/>
                    </Center>
                </GridItem>
                <GridItem>
                    <div className="float-right" style={{marginRight: "10px"}}>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                            <SignedOut>
                                <div className="signInButton">
                                    <SignInButton />
                                </div>
                            </SignedOut>
                    </div>
                </GridItem>
            </Grid>
        </div>
    )
}