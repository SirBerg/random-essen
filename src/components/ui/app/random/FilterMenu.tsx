import {Button, Center, Stack} from "@chakra-ui/react";
import {useEffect, useState} from "react";

export default function FilterMenu({updateCallback, width, height, generateCallback, parentState}:{updateCallback:Function, width:number, height:number, generateCallback:Function, parentState:string}){
    const [veganButtonColorScheme, setVeganButtonColorScheme] = useState("ghost")
    const [allButtonColorScheme, setAllButtonColorScheme] = useState('solid')
    const [vegetarianButtonColorScheme, setVegetarianButtonColorScheme] = useState('ghost')
    const [activeIDVegan, setActiveIDVegan] = useState('inactive')
    const [activeIDAll, stActiveIDAll] = useState('active')
    const [activeIDVegetarian, setActiveIDVegatarian] = useState('inactive')
    const [currentSelected, setCurrentState] = useState('all')
    const handleClick = (button:string) => {
        const activeElement = document.getElementById('active')
        console.log(currentSelected, parentState)


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
        setCurrentState(button)
        updateCallback(button)
    }

    useEffect(() => {
        updateCallback('all')
    }, []);

    useEffect(() => {
        setCurrentState(parentState)
    }, [parentState]);

    return(
        <Center className="filter-container" width={width} height={90} position="relative">
            <Stack direction="row">
                <Button onClick={()=>{generateCallback()}}>
                    Generate!
                </Button>
                <Button variant={veganButtonColorScheme} color="white" colorScheme="green" id={activeIDVegan} onClick={()=>handleClick('vegan')}>
                    Vegan
                </Button>
                <Button variant={allButtonColorScheme} color="white" colorScheme="green" id={activeIDVegan} onClick={()=>handleClick('all')}>
                    All
                </Button>
                <Button variant={vegetarianButtonColorScheme} color="white" colorScheme="green" id={activeIDVegan} onClick={()=>handleClick('vegetarian')}>
                    Vegetarian
                </Button>
            </Stack>
        </Center>
    )
}