import {Box, Center} from "@chakra-ui/react";
import {motion} from 'framer-motion'

export function IncludedIngredientsOverlay({removeOverlay, updateCallback}:{removeOverlay:Function, updateCallback:Function}){
    const evaluateClick = (event:any) =>{
        if(!event.target.id.includes('container')){
            console.log(event.target.id)
            removeOverlay()
        }
    }
    return(
        <Box h="100vh"
             position="absolute"
             w="100vw"
             left="0"
             top="0"
             bgColor="blackAlpha.900"
             zIndex="10"
        >
            <Center h="100vh" onClick={evaluateClick} id="backdrop">
                <Box
                    padding="10"
                    id="container"
                    backgroundColor="orange.500"
                    borderRadius="5px"
                    as={motion.div}
                    initial={{ scale: 0, translateY:-20, opacity: 0 }}
                    animate={{
                        scale: 1, translateY:0, opacity: 1
                    }}
                    exit={{
                        scale: 0,
                        opacity: 0
                    }}
                >
                    Hello
                </Box>
            </Center>
        </Box>
    )
}