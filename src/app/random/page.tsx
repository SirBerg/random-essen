'use client'
import {Center, AbsoluteCenter, Box, Stack, Button, Grid, Checkbox, GridItem} from "@chakra-ui/react";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
} from '@chakra-ui/react'

import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react'

import {ChevronDownIcon} from "@chakra-ui/icons";
import {useEffect, useState} from "react";
import * as types from '@/types/index'
import { redirect } from 'next/navigation'
import {Input} from "@chakra-ui/input";
export default function Handler(){
    const [ingredients, setIngredients] = useState(<></>)


    //making get requests
    async function makeGETRequest(location:string):Promise<string>{
        return new Promise(async (resolve:any, reject:any)=>{
            var requestOptions:RequestInit = {
                method: 'GET',
                redirect: 'follow'
            };

            await fetch(location, requestOptions)
                .then(response => response.text())
                .then((result) => {
                    console.log(result)
                    resolve(result)
                })
                .catch((error) => {
                    console.log('Error whilst making Fetch Request: ', error)
                    reject(error)
                });
        })
    }



    useEffect(() => {
        async function wrapper(){
            try{
                const manifest:string = await makeGETRequest("/api/manifest.json")

                let jsonManifest:types.manifest
                let ingredientManifest:types.ingredientManifest
                jsonManifest = await JSON.parse(manifest)
                let cacheString:string = await makeGETRequest(jsonManifest.paths.ingredients)
                ingredientManifest = await JSON.parse(cacheString)

                //fill the ingredients dropdowns
                setIngredients(

                    // @ts-ignore
                    ingredientManifest.ingredients.map((ingredient)=>{
                        return(
                            <Grid templateColumns="repeat(7, 1fr)" gap={0}>
                                <GridItem colSpan={1}>
                                    <Center h="100%">
                                        <Checkbox defaultChecked />
                                    </Center>
                                </GridItem>
                                <GridItem colSpan={6}>
                                    <MenuItem key={ingredient.name}>
                                        {ingredient.name}
                                    </MenuItem>
                                </GridItem>
                            </Grid>
                        )
                    })
                )
            }
            catch(e){
                console.log('Error: ', e)
            }
        }
        wrapper()
    }, []);

    return(
        <Box className="randomize-override">
            <link href="/stylesheets/random.css" type="text/css" rel="stylesheet" />
            <Grid templateColumns="repeat(7, 1fr)" gap={1} height="auto" position="relative">
                <GridItem overflow="hidden">
                    <Center bg="url(/meals/chili-con-carne.jpg)" className="meal-container">
                        <Button>
                            Chili con Carne
                        </Button>
                    </Center>
                </GridItem>
                <GridItem maxWidth="92vh" overflow="hidden">
                    <Center bg="url(/meals/flammkuchen.jpg)" className="meal-container">
                        <Button>
                            Flammkuchen
                        </Button>
                    </Center>
                </GridItem>
                <GridItem maxWidth="92vh" overflow="hidden">
                    <Center bg="url(/meals/hot-dog.jpg)" className="meal-container">
                        <Button>
                            Hot Dog
                        </Button>
                    </Center>
                </GridItem>
                <GridItem maxWidth="92vh" overflow="hidden">
                    <Center bg="url(/meals/lasagne.jpg)" className="meal-container">
                        <Button>
                            Lasagne
                        </Button>
                    </Center>
                </GridItem>
                <GridItem maxWidth="92vh" overflow="hidden">
                    <Center bg="url(/meals/pfannkuchen.jpg)" className="meal-container">
                        <Button>
                            Pfannkuchen
                        </Button>
                    </Center>
                </GridItem>
                <GridItem maxWidth="92vh" overflow="hidden">
                    <Center bg="url(/meals/pizza.webp)" className="meal-container">
                        <Button>
                           Pizza
                        </Button>
                    </Center>
                </GridItem>
                <GridItem maxWidth="92vh" overflow="hidden">
                    <Center bg="url(/meals/spaghetti-bolognese.jpg)" className="meal-container">
                        <Button wordBreak="break-word" padding="5px">
                            Spaghetti Bolognese
                        </Button>
                    </Center>
                </GridItem>
            </Grid>
            <Box>

            </Box>
        </Box>
    )
}