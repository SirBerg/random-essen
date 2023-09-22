import {
    Box,
    Button,
    Center,
    Input,
    NumberInput,
    NumberInputField,
    Select,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
    useToast
} from "@chakra-ui/react";

import * as types from '@/types/index'

import {useEffect, useState} from "react";

export function IngredientRow({name, unit, amount, healthyOption, callback, index}:{name:string, unit:string, amount:number, healthyOption:string, callback:Function, index:number}){
    return(
        <Tr>
            <Td>{name}</Td>
            <Td>{unit}</Td>
            <Td>{amount}</Td>
            <Td>{healthyOption}</Td>
            <Td><Center><Button colorScheme="red" onClick={()=>callback(index)}>Delete</Button></Center></Td>
        </Tr>
    )
}



export default function Ingredients({ingredientsObject={ingredients:[]}}:{ingredientsObject:{ingredients:types.frontend.ingredient}}){
    const toast = useToast()

    const [ingredientsTable, setIngredientsTable] = useState()
    const [invalidate, setInvalidate] = useState<boolean>(false)
    const [units, setUnits] = useState(<></>)
    const [unitPersistentStorage, setUnitPersistentStorage] = useState({})

    const renderIngredients = () => {
        return(setIngredientsTable(ingredientsObject.ingredients.map((ingredient:types.frontend.ingredient, index:number)=>{
            return(<IngredientRow name={ingredient.name} unit={ingredient.unit.name} amount={ingredient.amount} healthyOption={ingredient.healthyOption} key={index} callback={removeIngredient} index={index}/>)
        })))
    }

    const removeIngredient = (index:number) => {
        ingredientsObject.ingredients.splice(index, 1)
        renderIngredients()
    }

    const addIngredient = () => {
        const nameInput:HTMLElement | null = document.getElementById('name-input')
        const unitInput:HTMLElement | null  = document.getElementById('unit-input')
        const amountInput:HTMLElement | null = document.getElementById('amount-input')
        const healthyOptionInput:HTMLElement | null = document.getElementById('healthyOptionInput')

        console.log(healthyOptionInput)
        //if the input should not be found then just return (this shouldn't happen, how did you get here?)
        if(!nameInput || !unitInput || !amountInput || !amountInput || !healthyOptionInput){
            return
        }

        console.log(healthyOptionInput.value, unitInput.value, nameInput.value, amountInput.value)

        //invalidate the input fields if no input is detected
        if(!nameInput.value || !unitInput.value || !amountInput.value || !healthyOptionInput.value){
            setInvalidate(true)
            toast({
                title: 'Input Missing',
                description: 'Please fill out all the Fields before clicking "Add"',
                status: 'error',
                duration: 5000,
                isClosable: true
            })
            setTimeout(()=>{
                setInvalidate(false)
            }, 2000)
            return
        }
        const objectToPush:types.frontend.ingredient = {
            name: nameInput.value,
            unit: unitPersistentStorage.body[parseInt(unitInput.value)],
            amount: parseFloat(amountInput.value),

            //this is a select element, it cannot be outside of the filter names
            //@ts-ignore
            healthyOption: healthyOptionInput.value,
            creator: "test"
        }
        console.log(objectToPush)
        ingredientsObject.ingredients.push(objectToPush)
        renderIngredients()
    }


    useEffect(()=>{
        async function wrapper(){
            var requestOptions:any = {
                method: 'GET',
                redirect: 'follow'
            };

            await fetch("/api/manifests/units", requestOptions)
                .then(response => response.text())
                .then((result) =>{
                    try{
                        let res:types.apiTypes.unitManifestResponse = JSON.parse(result)
                        if(res.isError){
                            toast({
                                title: 'Whoops!',
                                description: "Seems like something didn't go as expected. You can either try again or send a mail with the Code #00002 to contact@sirberg.tokyo if you want to report this :)",
                                status: 'error',
                                duration: 5000,
                                isClosable: true
                            })
                            return
                        }
                        //@ts-ignore
                        setUnits(res.body.map((unit:types.unit, index:number)=>{
                            return(
                                <option value={index} key={index}>{unit.name}</option>
                            )
                        }))
                        setUnitPersistentStorage(res)
                    }
                    catch(e){
                        toast({
                            title: 'Whoops!',
                            description: "Seems like something didn't go as expected. You can either try again or send a mail with the Code #00001 to contact@sirberg.tokyo if you want to report this :)",
                            status: 'error',
                            duration: 5000,
                            isClosable: true
                        })
                    }
                })
                .catch(error => console.log('error', error));
        }
        wrapper()
    }, [])

    return(
        <TableContainer>
            <Box maxHeight="300px" height="300px" overflowY="scroll" maxWidth="100%">
                <Table variant='simple'>

                    <TableCaption>Ingredients for your meal</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Unit</Th>
                            <Th isNumeric>Amount</Th>
                            <Th>Is it healthy?</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody >
                        {ingredientsTable}
                        <Tr>
                            <Td><Input id="name-input" isInvalid={invalidate} width="5rem" /></Td>
                            <Td><Select placeholder='Select option' bgColor="gray.500" color="black" id="unit-input" width="5rem">
                                {units}
                            </Select></Td>
                            <Td isNumeric><NumberInput isInvalid={invalidate}><NumberInputField id="amount-input" width="4rem" padding={2} /></NumberInput></Td>
                            <Td><Select placeholder='Select option' bgColor="gray.500" color="black" id="healthyOptionInput" width="8rem">
                                <option value='meat' style={{color:"black"}}>Meat</option>
                                <option value='vegetarian' style={{color:"black"}}>Vegetarian</option>
                                <option value='vegan' style={{color:"black"}}>Vegan</option>
                            </Select></Td>
                            <Td><Center><Button colorScheme="green" onClick={addIngredient}>Add</Button></Center></Td>
                        </Tr>
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Unit</Th>
                            <Th isNumeric>Amount</Th>
                            <Th>Is it healthy?</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Tfoot>
                </Table>
            </Box>
        </TableContainer>
    )
}