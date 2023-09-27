'use client'
import {useEffect, useState} from "react";
import {redirect} from "next/navigation";
import {apiTypes, filterNames} from "@/types";
import {
    Box,
    Stack,
    useToast,
    Image,
    Spinner,
    Center,
    Skeleton,
    Grid,
    GridItem,
    Badge,
    Button,
    Input, InputLeftAddon
} from "@chakra-ui/react";
import {motion, useScroll} from "framer-motion";
import {useUser} from "@clerk/nextjs";
import {unified} from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import {LinkIcon} from '@chakra-ui/icons'
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
import {
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    useSteps,
} from '@chakra-ui/react'
import {InputGroup} from "@chakra-ui/input";
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react'


export function StepperDiscoverable({isDiscoverable, isApproved, orientation}:{isDiscoverable:boolean, isApproved:boolean, orientation: "vertical" | "horizontal"}){
    let steps = [
        {
          title: "Submitted",
          description: ""
        },
        {
            title: 'Admin ',
            description: ""
        },
        {
            title: "Randomizable",
            description: ""
        }
    ]
    let activeStepIndex:number = 0
    if(isApproved){
        activeStepIndex = 1
    }
    if(isDiscoverable){
        activeStepIndex = 2
    }
    const { activeStep }:{activeStep:number} = useSteps({
        index: activeStepIndex,
        count: steps.length
    })
    return(
        <Stepper index={activeStep} className="stepper" orientation={orientation} h="auto"
            marginBottom="40px"
        >
            {steps.map((step, index) => (
                <Step key={index}>
                    <StepIndicator>
                        <StepStatus
                            complete={<StepIcon />}
                            incomplete={<StepNumber />}
                            active={<StepNumber />}
                        />
                    </StepIndicator>

                    <Box flexShrink='0'>
                        <StepTitle>{step.title}</StepTitle>
                        <StepDescription>{step.description}</StepDescription>
                    </Box>

                    <StepSeparator />
                </Step>
            ))}
        </Stepper>
    )

}

export function UserModal({userName, userIcon, created, updated, healthyOption}:{userName:string, userIcon:string, created:Date, updated:Date, healthyOption: filterNames}){
    const colors={
        all:"white",
        meat: "red",
        vegetarian: "yellow",
        vegan: "green"
    }

    return(
        <Box>
            <strong>Creator</strong>
            <Box marginBottom="10px" />
            <Grid
                templateRows='repeat(2, 1fr)'
                templateColumns='repeat(5, 1fr)'
                h="50px"
            >
                <GridItem
                    colSpan={2}
                >
                    <Stack direction="row">
                        <Image
                            src={userIcon}
                            h="50px"
                            borderRadius="50px"
                        >
                        </Image>
                        <Stack direction="column">
                            <Box>
                                {userName}
                            </Box>
                            <Box>
                                {new Date(created).toLocaleDateString('de-DE')}
                            </Box>
                        </Stack>
                    </Stack>
                </GridItem>
                <GridItem colSpan={2}/>
                <GridItem rowSpan={2}>
                    <Center>
                        <Badge colorScheme={colors[healthyOption]}>{healthyOption}</Badge>
                    </Center>
                </GridItem>
            </Grid>
        </Box>
    )
}


export default function MealDisplay({ params }: { params: { id: string } }){
    const {user} = useUser()
    const toast = useToast()
    const alertManager = (title:string, message:string, status:'info' | 'warning' | "error" | "success" | "loading" | undefined) => {
        toast({
            title: title,
            description: message,
            status: status,
            duration: 5000,
            isClosable: true
        })
    }

    const [imageURL, setImageURL] = useState<string>('')
    const [recipeState, setRecipeState] = useState('')
    const [recipeIsLoaded, setRecipeIsLoaded] = useState(false)
    const [stepperIsDiscoverable, setStepperIsDiscoverable] = useState(<></>)
    const [userModalState, setUserModalState] = useState(<></>)
    const [userIsLoaded, setUserIsLoaded] = useState(false)
    const [mealTitle, setMealTitle] = useState(<></>)
    const [ingredientTable, setIngredientTable] = useState(<></>)
    const [returnObj, setReturnObj] = useState()
    const [persons, setPersons] = useState(0)

    function handleIngredientTableRender(){
        console.log(returnObj)
        if(!returnObj) return
        //create ingredient table
        setIngredientTable(
            <Tbody>
                {
                    //@ts-ignore
                    returnObj.body.ingredients.map((ingredient, index)=>{
                        return(
                            <Tr key={index}>
                                <Td>{ingredient.expand.IngredientID.name}</Td>
                                <Td>{ingredient.amount}</Td>
                                <Td>{ingredient.expand.IngredientID.expand.unit.name}</Td>
                            </Tr>
                        )
                    })
                }
            </Tbody>
        )
    }

    const handleShareButtonClick = () =>{
        alertManager('Copied to clipboard', 'The URL has been copied to your clipboard', 'success')
        navigator.clipboard.writeText(`https://meal.miko.sh/meal/${returnObj.body.meal.id}`);
    }

    const handleClick = ()=>{

        const inputField:any = document.getElementById('number-input')
        console.log(inputField.value)
        if(!inputField.value){
            console.log('none!')
            return
        }

        let cachedObj:apiTypes.mealDetailResponseObject = returnObj

        returnObj.body.ingredients.forEach((ingredient:ingredient, index:number)=>{
            cachedObj.body.ingredients[index].amount = returnObj.body.ingredients[index].amount / returnObj.body.meal.persons

            cachedObj.body.ingredients[index].amount = cachedObj.body.ingredients[index].amount * inputField.value
            console.log(cachedObj.body.ingredients[index].amount)
        })
        cachedObj.body.meal.persons = inputField.value
        console.log(cachedObj)
        setPersons(inputField.value)
        setReturnObj(cachedObj)
        console.log(cachedObj)
        handleIngredientTableRender()
    }

    //handles re-render of table object
    useEffect(() => {
        console.log('Updated Return Obj')
        handleIngredientTableRender()
    }, [returnObj]);

    useEffect(() => {

        if(!params.id){
            //this should not happen but just in case we will redirect to /404
            redirect("/404")
        }



        //fetch meal data from API
        async function wrapper(){
            try{
                const returnObject = await fetch(`/api/meal/${params.id}`)
                const mealObject:apiTypes.mealDetailResponseObject = await returnObject.json() as any as apiTypes.mealDetailResponseObject
                if(!mealObject || mealObject.isError){
                    alertManager("Error!", "Sorry but there has been an issue retrieving the Data for the meal, please reload the page or report this at contact@sirberg.tokyo with code #00007", "error")
                }
                setImageURL(mealObject.body.meal.image)
                const parseMarkdown = async (content:string):Promise<string> => {
                    return new Promise(async (resolve, reject)=>{
                        unified()
                            .use(remarkParse) // Parse markdown content to a syntax tree
                            .use(remarkRehype) // Turn markdown syntax tree to HTML syntax tree, ignoring embedded HTML
                            .use(rehypeStringify) // Serialize HTML syntax tree
                            .process(content)
                            .then((file) => resolve(String(file)))
                            .catch((error) => {
                                throw error
                            })
                    })
                }

                //parsing markdown to html
                const html:string = await parseMarkdown(mealObject.body.meal.recipe)
                setRecipeState(html)
                setRecipeIsLoaded(true)

                //showing stepper if the meal was created by user
                if(user && user.id == mealObject.body.meal.creator){
                    if(window.innerWidth <450){
                        setStepperIsDiscoverable(
                            <Stack direction="column">
                                <h2>Progress of approval</h2>
                                <StepperDiscoverable orientation="vertical" isDiscoverable={mealObject.body.meal.isDiscoverable} isApproved={mealObject.body.meal.isApproved} />
                            </Stack>
                        )
                    }
                    else{
                        setStepperIsDiscoverable(
                            <Stack direction="column">
                                <h2>Progress of approval</h2>
                                <StepperDiscoverable orientation="horizontal" isDiscoverable={mealObject.body.meal.isDiscoverable} isApproved={mealObject.body.meal.isApproved} />
                            </Stack>
                        )
                    }
                }
                setMealTitle(<h1>
                    {mealObject.body.meal.name}
                </h1>)
                setUserModalState(<UserModal userName={mealObject.body.meal.creatorName}
                                             userIcon={mealObject.body.meal.creatorIcon}
                                             created={mealObject.body.meal.created}
                                             updated={mealObject.body.meal.updated}
                                             healthyOption={mealObject.body.meal.healthyOption}
                />)
                setUserIsLoaded(true)
                setPersons(mealObject.body.meal.persons)
                setReturnObj(mealObject)
            }
            catch(e){
                console.log(e)
                alertManager("Error!", "Sorry but there has been an issue retrieving the Data for the meal, please reload the page or report this at contact@sirberg.tokyo with code #00007", "error")
            }

        }

        wrapper()
    }, [user]);
    return(
        <Box>
            <link rel="stylesheet" type="text/css" href="/stylesheets/markdown.css" />
            <link rel="stylesheet" type="text/css" href="/stylesheets/mealOverview.css" />

            <Stack direction="column">
                <Center w="100%" className="headerImage">
                    <Center>
                        <Image
                            fallback={<Spinner />}
                            src={imageURL}
                            className="headerImage"
                        />
                    </Center>
                </Center>
                <Box marginTop="330px" />
                {stepperIsDiscoverable}
                {mealTitle}
                <Skeleton isLoaded = {userIsLoaded}>
                    {userModalState}
                </Skeleton>
                <Box marginTop="20px" />
                <h3>Ingredients</h3>
                <Box>Ingredients for {persons} Persons</Box>
                <Skeleton isLoaded = {userIsLoaded}>
                    <TableContainer>
                        <Table variant='simple'>
                            <TableCaption>Ingredients for this Meal</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Amount</Th>
                                    <Th>Unit</Th>
                                </Tr>
                            </Thead>

                                {ingredientTable}
                            <Tfoot>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Amount</Th>
                                    <Th >Unit</Th>
                                </Tr>
                            </Tfoot>
                        </Table>
                    </TableContainer>
                </Skeleton>
                <Grid templateColumns="repeat(3, 1fr)">
                    <GridItem>
                        <Stack>
                            <Button onClick={handleShareButtonClick}>
                                Share
                                <LinkIcon />
                            </Button>
                        </Stack>
                    </GridItem>
                    <GridItem />
                    <GridItem>
                        <Stack direction="row" gap={1}>
                            <Box bgColor="white" color="black" p={2} borderRadius="5">Persons</Box>
                            <Center>
                                <NumberInput>
                                    <NumberInputField id="number-input" />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </Center>
                            <Center>
                                <Button onClick={handleClick}>Calc</Button>
                            </Center>
                        </Stack>
                    </GridItem>
                </Grid>
                <Box marginTop="30px" />
                <Skeleton h="40px" isLoaded={recipeIsLoaded} >
                    <Box dangerouslySetInnerHTML={{__html: recipeState}}/>
                </Skeleton>
                <Skeleton h="30px" isLoaded={recipeIsLoaded} />
                <Skeleton h="30px" isLoaded={recipeIsLoaded} />
                <Skeleton h="30px" isLoaded={recipeIsLoaded} />
            </Stack>
        </Box>
    )
}