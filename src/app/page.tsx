import Image from 'next/image'
import {Center, Stack} from "@chakra-ui/react";
import HomepageButton from "@/components/ui/button";
import Link from 'next/link'
export default function Home() {
  return (
    <Center h="80vh">
        <Stack>
            <h1>
                Random Essen
            </h1>
            <Center>
                <Stack direction="row">
                    <HomepageButton>
                        <Link href="/app">
                            Add a Meal
                        </Link>
                    </HomepageButton>
                    <HomepageButton>
                        <Link href="/random">
                            Randomize
                        </Link>
                    </HomepageButton>
                </Stack>
            </Center>
        </Stack>
    </Center>
  )
}
