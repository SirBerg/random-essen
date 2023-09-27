'use client'
import {Center, AbsoluteCenter, Box, Stack, Button, Grid, Checkbox, GridItem, useToast} from "@chakra-ui/react";
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
import {apiTypes} from "@/types/index";


export default function Handler(){
    const [overlayState, setOverlayState] = useState(<></>)
    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)
    const [object, setObject] = useState(undefined)
    const [gridItems, setGridItems] = useState(<></>)
    const [lock, setLock] = useState(
        [
            false,
            false,
            false,
            false,
            false,
            false,
            false
        ]
    )
    const toast = useToast()
    const alertManager = (title:string, message:string, status:'info' | 'warning' | "error" | "success" | "loading" | undefined) => {
        toast({
            title: title,
            description: message,
            status: status,
            duration: 5000,
            isClosable: true
        })
    }

    //the state of the object that is sent to the server
    const [requestObject, setRequestObject] = useState<types.apiTypes.randomizeRequest>({
        manifest: false,
        requestTime: new Date(),
        filter:{
            includedHealthyOption: "all",
        }
    })

    function manageSelectedFilter(filter: types.filterNames){
        setRequestObject({
            manifest: false,
            requestTime: new Date(),
            filter: {
                includedHealthyOption: filter
            }
        })
    }

    function handleCallbackLocking(index:number){
        console.log(`Locked Index with ID: ${index}`)
        let lockCacheArray = lock
        lockCacheArray[index] = !lock[index]
        setLock(lockCacheArray)
        if(lockCacheArray[index] === true){

            //@ts-ignore
            alertManager(`Locked Meal`, `${object.body.returnArray[index].name} has been locked and will not be randomize until you unlock it again`, "info")
        }
        else{
            //@ts-ignore
            alertManager(`Unlocked Meal`, `${object.body.returnArray[index].name} has been unlocked and will be randomized again`, "info")
        }
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
                    <RandomizationElement backgroundImage='Not yet defined' name='Not yet defined' uri="undefined" key={1} width={width} loading={loading}
                        callbackLock={handleCallbackLocking} index={0} currentLockStatus={lock}
                    />
                    <RandomizationElement backgroundImage='Not yet defined' name='Not yet defined' uri="undefined" key={2} width={width} loading={loading}
                        callbackLock={handleCallbackLocking} index={0} currentLockStatus={lock}
                    />
                    <RandomizationElement backgroundImage='Not yet defined' name='Not yet defined' uri="undefined" key={3} width={width} loading={loading}
                        callbackLock={handleCallbackLocking} index={0} currentLockStatus={lock}
                    />
                    <RandomizationElement backgroundImage='Not yet defined' name='Not yet defined' uri="undefined" key={4} width={width} loading={loading}
                        callbackLock={handleCallbackLocking} index={0} currentLockStatus={lock}
                    />
                    <RandomizationElement backgroundImage='Not yet defined' name='Not yet defined' uri="undefined" key={5} width={width} loading={loading}
                        callbackLock={handleCallbackLocking} index={0} currentLockStatus={lock}
                    />
                    <RandomizationElement backgroundImage='Not yet defined' name='Not yet defined' uri="undefined" key={6} width={width} loading={loading}
                         callbackLock={handleCallbackLocking} index={0} currentLockStatus={lock}
                    />
                    <RandomizationElement backgroundImage='Not yet defined' name='Not yet defined' uri="undefined" key={7} width={width} loading={loading}
                         callbackLock={handleCallbackLocking} index={0} currentLockStatus={lock}
                    />
                </>
            )
        }

        if(responseObject){
            setGridItems(
                <>
                    {responseObject.body.returnArray.map((meal:types.meal, index:number)=>{
                        return(
                            <RandomizationElement backgroundImage={meal.image} name={meal.name} uri={`/meal/${meal.id}`} key={index} width={width} loading={loading} callbackLock={handleCallbackLocking} index={index} currentLockStatus={lock}/>
                        )
                    })}
                </>
            )
        }

    }

    /*
    * Requests a new set of meal from the API and then calls the renderGridItems function to update the display
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
                    lock.forEach((isLocked:boolean, index:number) => {

                        //sort out locked objects and re-add them to the array that will be rendered
                        if(isLocked && object){
                            //@ts-ignore
                            returnObj.body.returnArray[index] = object.body.returnArray[index]
                        }
                    })

                    //@ts-ignore
                    setObject(returnObj)
                    resolve()
                })

                .catch((error) => {
                    alertManager('Error', "Sorry about that! There's been an error while fetching your meal. Please report this to contact@sirberg.tokyo with the Code #00008" ,"Error")
                    console.log('Error whilst fetching!', error)
                    reject()
                });
        })
    }

    useEffect(() => {
        renderGridItems(false, object)
    }, [object]);

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
                <Grid gap={1} className="random-grid" width={width - 40}>
                    {gridItems}
                </Grid>
            </Center>
            <FilterMenu updateCallback={manageSelectedFilter} generateCallback={reloadGridItems} width={width} height={height}/>
        </Box>
    )
}