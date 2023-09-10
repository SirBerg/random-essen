import Image from 'next/image'
import {Center, Stack} from "@chakra-ui/react";
import HomepageButton from "@/components/ui/button";
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
                        Add a Meal
                    </HomepageButton>
                    <HomepageButton>
                        Randomize
                    </HomepageButton>
                </Stack>
            </Center>
        </Stack>
    </Center>
  )
}
