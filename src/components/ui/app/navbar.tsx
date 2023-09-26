'use client'
import {Box, Button, Grid, GridItem} from "@chakra-ui/react";
import {useEffect, useState} from "react";

export default function Navbar({callbackFunction}:{callbackFunction:Function}){
    const [isDarkmode, setIsDarkmode]:any = useState('blackAlpha.300')
    useEffect(()=>{

        //setting init state
        //if it matches that means we are in darkmode
        if(window.matchMedia('(prefers-color-scheme:dark)').matches) {
            setIsDarkmode('whiteAlpha.300')
        }

        //attaching Eventlistener to later update values
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e:MediaQueryListEvent){
            console.log('===Switching sides===')

            //this means we are in darkmode
            if(e.matches){
                setIsDarkmode('whiteAlpha.300')
            }
            else if(!e.matches){
                setIsDarkmode('blackAlpha.300')
            }
        })
    },[])
return (
        <Box className="app-sidebar">
            <Grid templateColumns="repeat(9, 1fr)" gap={4}>
                <GridItem colSpan={3}>
                    <Button variant="solid" id="Editor" width="100%" onClick={(e)=>callbackFunction(e)}>
                        Editor
                    </Button>
                </GridItem>
                <GridItem colSpan={3}>
                    <Button variant="solid" id="List" width="100%" onClick={(e)=>callbackFunction(e)}>
                        My Meals
                    </Button>
                </GridItem>
                <GridItem colSpan={3}>
                    <Button variant="solid" isDisabled id="Recommended" width="100%" onClick={(e)=>callbackFunction(e)}>
                        Coming Soon
                    </Button>
                </GridItem>
            </Grid>
        </Box>
    )
}