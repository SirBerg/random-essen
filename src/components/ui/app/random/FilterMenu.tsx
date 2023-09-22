import {Button, Center, Stack} from "@chakra-ui/react";
import {useEffect, useState} from "react";

export default function FilterMenu({updateCallback, width, height, generateCallback}:{updateCallback:Function, width:number, height:number, generateCallback:Function}){
    const [veganButtonColorScheme, setVeganButtonColorScheme] = useState("ghost")
    const [allButtonColorScheme, setAllButtonColorScheme] = useState('solid')
    const [vegetarianButtonColorScheme, setVegetarianButtonColorScheme] = useState('ghost')


    const handleClick = (button:string) => {
        if(button === "vegan"){
            setVeganButtonColorScheme('solid')
            setAllButtonColorScheme('ghost')
            setVegetarianButtonColorScheme('ghost')
        }
        else if(button === "all"){
            setVeganButtonColorScheme('ghost')
            setAllButtonColorScheme('solid')
            setVegetarianButtonColorScheme('ghost')
        }
        else if(button === "vegetarian"){
            setVeganButtonColorScheme('ghost')
            setAllButtonColorScheme('ghost')
            setVegetarianButtonColorScheme('solid')
        }
        updateCallback(button)
    }

    useEffect(() => {
        updateCallback('all')
    }, []);

    return(
        <Center className="filter-container" width={width} height={90} position="relative">
            <Stack direction="row">
                <Button onClick={()=>{generateCallback()}}>
                    Generate!
                </Button>
                <Button variant={veganButtonColorScheme} color="white" colorScheme="green" onClick={()=>handleClick('vegan')}>
                    Vegan
                </Button>
                <Button variant={allButtonColorScheme} color="white" colorScheme="green" onClick={()=>handleClick('all')}>
                    All
                </Button>
                <Button variant={vegetarianButtonColorScheme} color="white" colorScheme="green" onClick={()=>handleClick('vegetarian')}>
                    Vegetarian
                </Button>
            </Stack>
        </Center>
    )
}