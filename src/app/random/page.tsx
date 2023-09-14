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
import {ChevronDownIcon} from "@chakra-ui/icons";
import {useEffect, useState} from "react";
import * as types from '@/types/index'
import { redirect } from 'next/navigation'

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
        <AbsoluteCenter>
            <Box>
                <Grid templateColumns="repeat(3, 1fr)" gap={5}>
                    <Stack>
                        <b>Include these Ingredients</b>
                        <Menu>
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                none
                            </MenuButton>
                            <Center>
                                <MenuList color="black">
                                    {ingredients}
                                </MenuList>
                            </Center>
                        </Menu>
                    </Stack>
                    <Stack>
                        <b>Exclude these Ingredients</b>
                        <Menu>
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                none
                            </MenuButton>
                            <MenuList color="black">
                                {ingredients}
                            </MenuList>
                        </Menu>
                    </Stack>
                    <Stack>
                        <b>Include these Ingredients</b>
                        <Menu>
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                none
                            </MenuButton>
                            <MenuList  color="black">
                            </MenuList>
                        </Menu>
                    </Stack>
                </Grid>

            </Box>
        </AbsoluteCenter>
    )
}