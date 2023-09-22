import Image from 'next/image'
import {Button, Center, Stack} from "@chakra-ui/react";
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
                    <Button isDisabled>
                        Add a Meal
                    </Button>
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
