import {Input, InputGroup, InputLeftElement} from "@chakra-ui/input";
import {Box, IconButton, Center, Stack} from "@chakra-ui/react";
import {SearchIcon} from "@chakra-ui/icons";
import {FormEvent, useState, useEffect, useRef} from "react";
import Link from "next/link";

export default function SearchBar(){
    const [searchResult, setSearchResult] = useState(<></>)
    useEffect(() => {

        //remove on esc press
        document.addEventListener('keydown', (event:KeyboardEvent) => {
            if(event.code === 'Escape'){
                setSearchResult(<></>)
            }
        })


        //remove search results when clicking outside of them
        document.addEventListener('click', e=>{
            const clickedOnElement:Element | null = document.elementFromPoint(e.clientX, e.clientY)
            if(!clickedOnElement || clickedOnElement && !clickedOnElement.id.includes('result')){
                setSearchResult(<></>)
            }
        }, {passive: true})
    }, []);
    const handleInput = (e:FormEvent<HTMLInputElement>) => {
        setSearchResult(
            <Center width="100vw" position="absolute" left="0" top="86px" id="result-center">
                <Box className="search-result" id="result-box">
                    <Stack>
                        <b>Hello World!</b>
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
                <Input isDisabled placeholder='Search for a meal' style={{caretColor:"blue"}} onInput={(e)=>handleInput(e)} color="black" maxWidth="280px"/>
            </InputGroup>
            {searchResult}
        </div>
    )
}