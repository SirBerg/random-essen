'use client'
import {Box, Button, Center, GridItem, Spinner, Image, Stack, useToast} from "@chakra-ui/react";
import {motion, useAnimationControls} from "framer-motion";
import {useEffect, useState} from "react";
import {LockIcon, UnlockIcon} from '@chakra-ui/icons'


//TODO: implement locking of meals
export default function RandomizationElement({backgroundImage, name, uri, width, loading, callbackLock, index, currentLockStatus}: {backgroundImage:string, name: string, uri: string, width:number, loading:boolean, callbackLock:Function, index:number, currentLockStatus:boolean[]}){
    const [containerBackgroundImageOpacity, setContainerBackgroundImageOpacity] = useState(0)
    const [scaleFactor, setScaleFactor] = useState(1)
    const [isDarkmode, setIsDarkmode] = useState('gray.200')
    const [showLockIcon, setShowLockIcon] = useState(<></>)
    const [hovering, setHovering] = useState(false)
    const controls = useAnimationControls()

    const toast = useToast()

    function controlComponentScale(){
        setHovering(true)
        controls.start({scale: 1.1, borderRadius:"5px"})
    }

    function stopComponentScale(){
        setHovering(false)
        controls.start({scale: 1, borderRadius:"5px"})
    }

    function handleToggleClick(){

    }

    //handles rendering of the lock icon
    function handleToggleHover(){
        if(hovering === true){
            if(currentLockStatus[index] === true){
                setShowLockIcon(
                    <Box
                        as={motion.div}
                        initial={{opacity:0, y:-25}}
                        animate={{opacity:1, y:0}}
                    >
                        <Button onClick={()=>callbackLock(index)}>
                            <LockIcon />
                        </Button>
                    </Box>
                )
            }
            else{
                setShowLockIcon(
                    <Box
                        as={motion.div}
                        initial={{opacity:0, y:-25}}
                        animate={{opacity:1, y:0}}
                    >
                        <Button onClick={()=>callbackLock(index)}>
                            <UnlockIcon />
                        </Button>
                    </Box>
                )
            }
        }
        else{
            setShowLockIcon(<></>)
        }

    }

    //listens to hovering to render the lock icon
    useEffect(() => {
        handleToggleHover()
    }, [hovering]);

    //listening to update of lock
    useEffect(() => {
        handleToggleHover()
    }, [currentLockStatus[index]]);

    useEffect(() => {
        //setting init state
        //if it matches that means we are in darkmode
        if(window.matchMedia('(prefers-color-scheme:dark)').matches) {
            setIsDarkmode('gray.800')
        }
        //attaching Eventlistener to later update values
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e:MediaQueryListEvent){
            console.log('===Switching sides===')

            //this means we are in darkmode
            if(e.matches){
                setIsDarkmode('gray.200')
            }
            else if(!e.matches){
                setIsDarkmode('gray.800')
            }
        })
    }, []);



    return(
        <GridItem overflow="hidden" position="relative" width="100%">
            {
                //if loading is set to true, we do this
                loading ? (
                    <Center className="meal-container">
                        <Spinner />
                    </Center>
                ):(
                    <div>
                        <Image
                            as={motion.img}
                            src={backgroundImage}
                            fallback={<Center><Spinner /></Center>}
                            width="100%"
                            style={{
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                            scale={scaleFactor}
                            className="meal-container"
                            animate={controls}
                            borderRadius={5}
                            borderWidth={1}
                            borderColor={isDarkmode}
                            borderStyle="solid"
                        />
                        <Center className="meal-container-text" marginTop="-84vh" as={motion.div}
                                onMouseEnter={()=>controlComponentScale()}
                                onMouseLeave={()=>stopComponentScale()}
                        >
                            <Stack>
                                <Center>
                                    {showLockIcon}
                                </Center>
                                <Button as="a" href={uri}>
                                    {name}
                                </Button>
                            </Stack>
                        </Center>
                    </div>
                )
            }
        </GridItem>
    )
}