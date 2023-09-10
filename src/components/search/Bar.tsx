import {Input, InputGroup, InputLeftElement} from "@chakra-ui/input";
import {Box, IconButton, Center, Stack} from "@chakra-ui/react";
import {SearchIcon} from "@chakra-ui/icons";
import {FormEvent, useState, useEffect, useRef} from "react";
import Link from "next/link";

/*
*                 <Box
                    as = {motion.div}
                    initial={{
                        opacity: 0,
                        scale: 0.9
                    }}
                    animate = {{
                        scale: 1.1,
                        opacity: 1
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.9
                    }}
                >
* */

export default function SearchBar(){
    const [searchResult, setSearchResult] = useState(<></>)

    const handleInput = (e:FormEvent<HTMLInputElement>) => {
        console.log(e.target.width)
        setSearchResult(
            <Center width="100vw" position="absolute" left="0" top="86px">
                <Box className="search-result">
                    <Stack>
                        <Link href="/hello-world"><b>Hello World!</b></Link>
                        <Box className="search-result-description">Hello</Box>
                    </Stack>
                </Box>
            </Center>
        )
    }
    return(
        <div>
            <InputGroup variant="solid" borderWidth="1px" borderColor="gray" borderRadius="5px" >
                <InputLeftElement pointerEvents='none'>
                    <SearchIcon color="black" />
                </InputLeftElement>
                <Input placeholder='Search for a meal' style={{caretColor:"blue"}} onInput={(e)=>handleInput(e)} color="black" maxWidth="280px"/>
            </InputGroup>
            {searchResult}
        </div>
    )
}