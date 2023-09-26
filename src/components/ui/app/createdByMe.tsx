import {useEffect, useState} from "react";
import {Box, Button, Center, Grid, GridItem, Spinner, Stack} from "@chakra-ui/react";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'
import {apiTypes, meal} from "@/types";
import Link from "next/link";
export default function CreatedByMe(){
    const [tableRender, setTableRender] = useState(false)
    const [page, setPage] = useState(1)
    const [invalidateForward, setInvalidateForward] = useState(false)
    const [invalidateBackward, setInvalidateBackward] = useState(true)
    function handleRender(responseObject:apiTypes.createdByMeResponse){

    }

    //if forward is true then we go farward else we go back one page
    async function handleForwardBackward(forward:boolean){
        if(forward){
                setPage(page+1)
                setInvalidateBackward(false)
        }
        if(!forward){
            if(page-1 <=0){
                console.log('Ignored, due to invalid Page number')
            }
            else{
                setPage(page-1)
            }
            if(page-1 == 1){
                setInvalidateBackward(true)
            }
        }
        let response = await fetch(`/api/app/user/created?page=${page}`)
        let responseObject:apiTypes.createdByMeResponse = await response.json()

        //this is to provide user feedback that they've reached the end of the list
        if(responseObject.body.length == 0 || responseObject.body.length < 50){
            setInvalidateForward(true)
        }
        else{
            setInvalidateForward(false)
        }
    }

    useEffect(() => {

        //TODO: Implement Error handling and way to switch pages
        async function wrapper():Promise<void>{
            let response =  await fetch("/api/app/user/created?page=1")
            let responseObject:apiTypes.createdByMeResponse = await response.json()

            if(responseObject.body.length == 0){
                //@ts-ignore
                setTableRender(()=>{
                    return(
                        <Tr>
                            <Td colSpan={4}>
                                <Center p={5}>
                                    <Spinner></Spinner>
                                </Center>
                            </Td>
                        </Tr>
                    )
                })
            }

            //@ts-ignore
            setTableRender(responseObject.body.map((mealResponse:meal, index)=>{
                return(
                    <Tr key={index}>
                        <Td>{mealResponse.name}</Td>
                        <Td><Link href={mealResponse.image} target="_blank">Link</Link></Td>
                        <Td>{mealResponse.healthyOption}</Td>
                        <Td><Button as="a" href={`/meal/${mealResponse.id}`} colorScheme="green">Link</Button></Td>
                        <Td>{mealResponse.isApproved.toString()}</Td>
                    </Tr>
                )
            }))

            if(responseObject.body.length == 0 || responseObject.body.length < 50){
                setInvalidateForward(true)
            }
            else{
                setInvalidateForward(false)
            }
        }
        wrapper()
    }, []);
    return (
        <Box position="relative" h="100%" marginTop="20px">
            <Center>
                <Stack overflowX="scroll">
                    <h1>My created Meals</h1>
                    <TableContainer borderRadius="5px" borderWidth="1px" borderColor="gray.500" paddingLeft="5px" paddingRight="5px">
                        <Table variant="simple" >
                            <TableCaption>Your created Meals</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Image</Th>
                                    <Th>Vegetarian/Vegan/Meal</Th>
                                    <Th>Link</Th>
                                    <Th>Approved?</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {tableRender ? (
                                    tableRender
                                ):(
                                    <tr>
                                        <td colSpan={4}>
                                            <Center p={5}>
                                                <Spinner></Spinner>
                                            </Center>
                                        </td>
                                    </tr>
                                )}
                            </Tbody>
                            <Tfoot>
                                <Th>Name</Th>
                                <Th>Image</Th>
                                <Th>Vegetarian/Vegan/Meal</Th>
                                <Th>Link</Th>
                                <Th>Approved?</Th>
                            </Tfoot>
                        </Table>
                    </TableContainer>
                    <Grid
                        templateColumns="repeat(4, 1fr)"
                    >
                        <GridItem>
                            <Button isDisabled={invalidateBackward} onClick={()=>handleForwardBackward(false)}>{"<-"}Backward</Button>
                        </GridItem>
                        <GridItem colSpan={2}><Center><strong>{page}</strong></Center></GridItem>
                        <GridItem alignItems="right">
                            <Button isDisabled={invalidateForward} marginLeft="auto" marginRight="0" onClick={()=>handleForwardBackward(true)}>Forward {"->"}</Button>
                        </GridItem>
                    </Grid>
                </Stack>
            </Center>
        </Box>
    )
}