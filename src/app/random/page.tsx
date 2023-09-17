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
import {Input} from "@chakra-ui/input";
import RandomizationElement from "@/components/ui/app/random/RandomizationElement";
import {IncludedIngredientsOverlay} from '@/components/ui/app/random/Overlays'

export default function Handler(){
    const [overlayState, setOverlayState] = useState(<></>)
    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)

    //manifests
    const [ingredientManifest, setIngredientManifest] = useState({})

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

    const handleFilterClick = (type:"include" | "exclude" | "healthyOption")=>{
        setOverlayState(<IncludedIngredientsOverlay removeOverlay={removeOverlay}/>)
    }

    function removeOverlay(){
        setOverlayState(<></>)
    }


    useEffect(() => {
        function handleResize(){
            setHeight(window.innerHeight)
            setWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        handleResize()
    }, []);

    return(
        <Box>
            {overlayState}
            <link href="/stylesheets/random.css" type="text/css" rel="stylesheet" />
            <Center width={width - 40}>
                <Grid gap={1} className="random-grid" width={width - 40}>
                    <RandomizationElement backgroundImage="/meals/chili-con-carne.jpg" name="Chili con Carne" uri="string" />
                    <RandomizationElement backgroundImage="/meals/flammkuchen.jpg" name="Flammkuchen" uri="string" />
                    <RandomizationElement backgroundImage="/meals/hot-dog.jpg" name="Hot Dog" uri="string" />
                    <RandomizationElement backgroundImage="/meals/lasagne.jpg" name="Lasagne" uri="string" />
                    <RandomizationElement backgroundImage="/meals/pfannkuchen.jpg" name="Pfannkuchen" uri="string" />
                    <RandomizationElement backgroundImage="/meals/pizza.webp" name="Pizza" uri="string" />
                    <RandomizationElement backgroundImage="/meals/spaghetti-bolognese.jpg" name="Spaghetti Bolognese" uri="string" />
                </Grid>
            </Center>
            <Center className="filter-container" width={width} height={75} bgColor="orange.500">
                {
                    width < 1000 ? (
                        <Menu>
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                Actions
                            </MenuButton>
                            <MenuList color="black">
                                <MenuItem>
                                    Vegan
                                </MenuItem>
                                <MenuItem>
                                    Vegetarian
                                </MenuItem>
                                <MenuItem>
                                    All
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    ) : (
                        <Stack direction="row">
                            <Button variant="outline">
                                Vegan
                            </Button>
                            <Button colorScheme="green">
                                All
                            </Button>
                            <Button variant="outline">
                                Vegetarian
                            </Button>
                        </Stack>
                    )
                }
            </Center>
        </Box>
    )
}