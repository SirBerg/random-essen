'use client'
import {Button, Center, GridItem} from "@chakra-ui/react";

export default function RandomizationElement({backgroundImage, name, uri}: {backgroundImage:string, name: string, uri: string}){
    return(
        <GridItem overflow="hidden">
            <Center bg={`url(${backgroundImage})`} className="meal-container">
                <Button>
                    {name}
                </Button>
            </Center>
        </GridItem>
    )
}