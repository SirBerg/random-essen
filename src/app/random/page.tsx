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
import {RequestOptions} from "https";


export default function Handler(){
    const [overlayState, setOverlayState] = useState(<></>)
    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)

    const [gridItems, setGridItems] = useState(<></>)

    //the state of the object that is sent to the server
    const [requestObject, setRequestObject] = useState<types.apiTypes.randomizeRequest>({
        manifest: false,
        requestTime: new Date(),
        filter:{
            includedHealthyOption: "all",
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
                includedHealthyOption: filter
            }
        })
    }


    /*
    * Renders the 7 grid items
    *
    * @param responseObject:types.apiTypes.randomizeResponse
    *
    * @returns void
    * */
    function renderGridItems(loading:boolean, responseObject?:types.apiTypes.randomizeResponse){
        setWidth(window.innerWidth)

        if(loading){
            setGridItems(
                <>
                    <RandomizationElement backgroundImage='Not yet defined' name='Not yet defined' uri="undefined" key={1} width={width} loading={loading}/>
                    <RandomizationElement backgroundImage='Not yet defined' name='Not yet defined' uri="undefined" key={2} width={width} loading={loading}/>
                    <RandomizationElement backgroundImage='Not yet defined' name='Not yet defined' uri="undefined" key={3} width={width} loading={loading}/>
                    <RandomizationElement backgroundImage='Not yet defined' name='Not yet defined' uri="undefined" key={4} width={width} loading={loading}/>
                    <RandomizationElement backgroundImage='Not yet defined' name='Not yet defined' uri="undefined" key={5} width={width} loading={loading}/>
                    <RandomizationElement backgroundImage='Not yet defined' name='Not yet defined' uri="undefined" key={6} width={width} loading={loading}/>
                    <RandomizationElement backgroundImage='Not yet defined' name='Not yet defined' uri="undefined" key={7} width={width} loading={loading}/>
                </>
            )
        }

        if(responseObject){
            setGridItems(
                <>
                    {responseObject.body.returnArray.map((meal:types.meal)=>{
                        return(
                            <RandomizationElement backgroundImage={meal.image} name={meal.name} uri="undefined" key={meal.id} width={width} loading={loading}/>
                        )
                    })}
                </>
            )
        }

    }

    /*
    * Requests a new set of meals from the API and then calls the renderGridItems function to update the display
    * @returns void
    * */
    async function reloadGridItems(){
        return new Promise(async (resolve:Function, reject:Function)=>{
            renderGridItems(true)
            //fetch from API using the requestObject (managed by another function)
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify(requestObject);

            var requestOptions:any = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            await fetch("/api/randomize", requestOptions)
                .then(response => response.text())
                .then((result:string) => {
                    const returnObj:types.apiTypes.randomizeResponse = JSON.parse(result)
                    console.log(returnObj)
                    renderGridItems(false, returnObj)
                    resolve()
                })

                //TODO: implement way to visually indicate error to user
                .catch((error) => {
                    console.log('Error whilst fetching!', error)
                    reject()
                });
        })
    }
    function handleResize(){
        setHeight(window.innerHeight)
        setWidth(window.innerWidth)
    }
    useEffect(() => {

        window.addEventListener('resize', handleResize)
        handleResize()

        //initial fetch run
        async function wrapper(){
            await reloadGridItems()
        }
        wrapper()

        //remove on esc press
        document.addEventListener('keydown', async (event:KeyboardEvent) => {
            if(event.code === 'Space'){
                await reloadGridItems()
            }
        })
    }, []);

    return(
        <Box>
            {overlayState}
            <link href="/stylesheets/random.css" type="text/css" rel="stylesheet" />
            <Center width={width - 40}>
                {
                    /*                <Grid gap={1} className="random-grid" width={width - 40}>
                    <RandomizationElement backgroundImage="/meals/chili-con-carne.jpg" name="Chili con Carne" uri="string" />
                    <RandomizationElement backgroundImage="/meals/flammkuchen.jpg" name="Flammkuchen" uri="string" />
                    <RandomizationElement backgroundImage="/meals/hot-dog.jpg" name="Hot Dog" uri="string" />
                    <RandomizationElement backgroundImage="/meals/lasagne.jpg" name="Lasagne" uri="string" />
                    <RandomizationElement backgroundImage="/meals/pfannkuchen.jpg" name="Pfannkuchen" uri="string" />
                    <RandomizationElement backgroundImage="/meals/pizza.webp" name="Pizza" uri="string" />
                    <RandomizationElement backgroundImage="/meals/spaghetti-bolognese.jpg" name="Spaghetti Bolognese" uri="string" />
                </Grid>*/
                }
                <Grid gap={1} className="random-grid" width={width - 40}>
                    {gridItems}
                </Grid>
            </Center>
            <FilterMenu updateCallback={manageSelectedFilter} generateCallback={reloadGridItems} width={width} height={height}/>
        </Box>
    )
}