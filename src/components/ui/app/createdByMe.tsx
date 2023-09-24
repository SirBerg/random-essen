import {useEffect, useState} from "react";
import {Box, Button, Center, Spinner} from "@chakra-ui/react";
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
    useEffect(() => {
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
            setTableRender(responseObject.body.map((mealResponse:meal)=>{
                console.log(mealResponse)
                return(
                    <Tr>
                        <Td>{mealResponse.name}</Td>
                        <Td><Link href={mealResponse.image} target="_blank">Link</Link></Td>
                        <Td>{mealResponse.healthyOption}</Td>
                        <Td><Button as="a" href={`/meal/${mealResponse.id}`} colorScheme="green">Link</Button></Td>
                        <Td>{mealResponse.isApproved.toString()}</Td>
                    </Tr>
                )
            }))

        }
        wrapper()
    }, []);
    return (
        <Box position="relative" h="100%" marginTop="20px">
            <Center>
                <TableContainer borderRadius="5px" borderWidth="1px" borderColor="gray.500" paddingLeft="5px" paddingRight="5px">
                    <Table variant="simple" >
                        <TableCaption>Imperial to metric conversion factors</TableCaption>
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
            </Center>
        </Box>
    )
}