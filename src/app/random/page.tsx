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
import FilterMenu from "@/components/ui/app/random/FilterMenu";


export default function Handler(){
    const [overlayState, setOverlayState] = useState(<></>)
    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)

    const [backgroundImage, setBackgroundImage] = useState(undefined)


    const [requestObject, setRequestObject] = useState<types.apiTypes.randomizeRequest>({
        manifest: false,
        requestTime: new Date(),
        filter:{
            includedHealthyOptions: "all",
        }
    })


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


    function manageSelectedFilter(filter: types.filterNames){
        setRequestObject({
            manifest: false,
            requestTime: new Date(),
            filter: {
                includedHealthyOptions: filter
            }
        })
    }

    useEffect(() => {
        function handleResize(){
            setHeight(window.innerHeight)
            setWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        handleResize()
    }, []);

    const toggleBGImage = () =>{
        console.log(backgroundImage)
        if(!backgroundImage){
            setBackgroundImage("/meals/chili-con-carne.jpg")
        }
        else{
            setBackgroundImage(undefined)
        }
    }

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
            <FilterMenu updateCallback={manageSelectedFilter} width={width} />
        </Box>
    )
}