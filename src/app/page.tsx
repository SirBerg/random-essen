'use client'
import Image from 'next/image'
import {Box, Button, Center, Stack} from "@chakra-ui/react";
import HomepageButton from "@/components/ui/button";
import Link from 'next/link'
import {motion} from "framer-motion";
export default function Home() {
  return (
    <Center h="80vh">
        <Stack>
            <h1>
                Random Essen
            </h1>
            <Center>
                <Stack direction="row">
                    <Box
                        as={motion.div}
                        initial={{opacity:0, y:-25}}
                        animate={{opacity:1, y:0}}
                    >
                        <Button as="a" href="/app">
                            Add a Meal
                        </Button>
                    </Box>
                    <Box
                        as={motion.div}
                        initial={{opacity:0, y:25}}
                        animate={{opacity:1, y:0}}
                    >
                        <HomepageButton>
                            <Link href="/random">
                                Randomize
                            </Link>
                        </HomepageButton>
                    </Box>
                </Stack>
            </Center>
        </Stack>
    </Center>
  )
}
