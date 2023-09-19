'use client'
import {Box, Button, Center, GridItem, Spinner, Image, Stack} from "@chakra-ui/react";
import {motion, useAnimationControls} from "framer-motion";
import {useEffect, useState} from "react";
export default function RandomizationElement({backgroundImage, name, uri}: {backgroundImage:string, name: string, uri: string}){
    const [containerBackgroundImageOpacity, setContainerBackgroundImageOpacity] = useState(0)
    const [loading, setImageLoading] = useState(true)

    const [scaleFactor, setScaleFactor] = useState(1)
    const controls = useAnimationControls()
    function controlComponentScale(){
        controls.start({scale: 1.1})
    }

    function stopComponentScale(){
        controls.start({scale: 1})
    }

    return(
        <GridItem overflow="hidden" width="100%">
            {
                backgroundImage ? (
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
                        />
                        <Center className="meal-container-text" marginTop="-84vh" as={motion.div} onMouseEnter={()=>controlComponentScale()} onMouseLeave={()=>stopComponentScale()}
                        >
                            <Button>
                                Hello World!
                            </Button>
                        </Center>
                    </div>
                ): (
                    <Center h="100%" position="relative" className="meal-container">
                        <Spinner />
                    </Center>
                )
            }
        </GridItem>
    )
}