import {
    Box,
    Button,
    Center,
    Grid,
    GridItem,
    NumberInput,
    NumberInputField,
    Select,
    Stack,
    Textarea, useToast
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import {Input} from "@chakra-ui/input";
import {auth, useUser} from "@clerk/nextjs";
import Ingredients from "@/components/ui/app/editor/ingredients";
import {apiTypes} from "@/types";
import baseResponse = apiTypes.baseResponse;
import mealCreationRequest = apiTypes.mealCreationRequest;

export default function Editor(){
    const toast = useToast()
    const {isLoaded, isSignedIn, user} = useUser()
    const [fieldValue, setFieldValue] = useState("")
    const [recipeIsSubmitted, setRecipeIsSubmitted] = useState(false)
    const [invalidateName, setInvalidateName] = useState(false)
    const [invalidateImage, setInvalidateImage] = useState("gray.600")
    const [invalidateHealthyOption, setInvalidateHealthyOption] = useState(false)
    const [invalidatePersons, setInvalidatePersons] = useState(false)
    const [invalidateRecipe, setInvalidateRecipe] = useState(false)


    const [ingredients, setIngredients] = useState({
        ingredients: []
    })

    const [renderedPreview, setRenderedPreview] = useState("")

    function insertAtCursor(value:string){

        //@ts-ignore
        const input:HTMLInputElement | null = document.getElementById('editor-field')
        if(!input) return
        input.focus()
        const [start, end]:any = [input.selectionStart, input.selectionEnd];
        input.setRangeText(value, start, end, 'select')
    }


    const handleFieldUpdate = (e:any) => {
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
        async function wrapper(){
            let test:string = await parseMarkdown(e.target.value)
            setRenderedPreview(test)
        }
        wrapper()
    }

    const alertManager = (title:string, message:string, status:'info' | 'warning' | "error" | "success" | "loading" | undefined) => {
        toast({
            title: title,
            description: message,
            status: status,
            duration: 5000,
            isClosable: true
        })
    }

    const handleSubmit = async (e:any) => {
        e.preventDefault()
        setRecipeIsSubmitted(true)

        //@ts-ignore
        const editorField:HTMLElement | HTMLInputElement = document.getElementById('editor-field')
        //@ts-ignore
        const nameField:HTMLElement | HTMLInputElement = document.getElementById('name-field')
        //@ts-ignore
        const healthyOptionField:HTMLElement | HTMLInputElement = document.getElementById('healthyOption-field')
        //@ts-ignore
        const personsField:HTMLElement | HTMLInputElement = document.getElementById('persons-field')
        //@ts-ignore
        const imageField:HTMLElement | HTMLInputElement = document.getElementById('image-field')
        //console.log(editorField.value, nameField.value, healthyOptionField.value, personsField.value)

        //check if everything is here and filled out
        if(!editorField || !nameField || !healthyOptionField || !personsField || !imageField ){
            alertManager('Whoops!', "Something wen't seriously wrong with the page, please consider reloading if this error persist! (Code: #00004)", 'error')
            return
        }
        //@ts-ignore
        if(!editorField.value || !nameField.value || !healthyOptionField.value || !personsField.value || imageField.files.length === 0 || ingredients.ingredients.length === 0){
            setRecipeIsSubmitted(false)
            alertManager('Missing Data', "It seems like you might've forgotten some fields! Please check if you have filled out every field and then try again (Code: #00005)", 'warning')
            //@ts-ignore
            if(!editorField.value){
                setInvalidateRecipe(true)
                setTimeout(()=>{
                    setInvalidateRecipe(false)
                }, 2000)
            }
            //@ts-ignore
            if(!nameField.value){
                setInvalidateName(true)
                setTimeout(()=>{
                    setInvalidateName(false)
                }, 2000)
            }
            //@ts-ignore
            if(!healthyOptionField.value){
                setInvalidateHealthyOption(true)
                setTimeout(()=>{
                    setInvalidateHealthyOption(false)
                }, 2000)
            }
            //@ts-ignore
            if(!personsField.value){
                setInvalidatePersons(true)
                setTimeout(()=>{
                    setInvalidatePersons(false)
                }, 2000)
            }
            //@ts-ignore
            if(imageField.files.length === 0){
                setInvalidateImage("red.500")
                setTimeout(()=>{
                    setInvalidateImage("gray.600")
                }, 2000)
            }
            if(ingredients.ingredients.length === 0){
                alertManager('Please provide Ingredient', "A meal needs ingredients, please provide some (Code:#00006)", 'error')
            }
            return
        }
        //perform black magic to upload file
        const formData:FormData = new FormData()
        //@ts-ignore
        Object.values(imageField.files).forEach(file=> {
            //@ts-ignore
            formData.append('file', file)
        })
        formData.append('id', 'not-yet-known')
        const response:Response = await fetch('/api/app/upload', {
            method: 'POST',
            body: formData
        });

        const body:apiTypes.uploadResponse | apiTypes.baseResponse = await response.json() as apiTypes.uploadResponse | apiTypes.baseResponse;
        if(body.isError === true){
            setRecipeIsSubmitted(false)
            alertManager('File Upload Error!', "Sorry, but we're having trouble uploading your Image :( . Maybe try another one or try again later. \n If you are really cool then you could report this to contact@sirberg.tokyo with the code #00003", 'error')
            //If this was indeed an error then we should not continue
            return
        }

        //upload the rest of the meal
        const uploadObject:mealCreationRequest = {
            requestTime: new Date(),
            manifest: false,
            body:{
                //@ts-ignore
                name: nameField.value.replaceAll("<", "<_"),
                //@ts-ignore
                image: body.filePath,
                //@ts-ignore
                healthyOption: healthyOptionField.value,
                ingredients: ingredients.ingredients,
                //@ts-ignore
                recipe: editorField.value,

                //@ts-ignore <- without this a type error occurs here because user could be undefined or null but the user has to be authenticated already to access this page(handled by the middleware)
                userID: user.id,
                //@ts-ignore see above comment
                userIcon: user?.imageUrl,
                //@ts-ignore
                userName: user?.fullName ? user.fullName : user.id,
                //@ts-ignore
                persons: parseInt(personsField.value)
            }
        }
        //send to server and create meal
        const mealCreationResponse:Response = await fetch("/api/app", {
            method: "POST",
            body: JSON.stringify(uploadObject)
        })

        const mealCreationBody: baseResponse = await mealCreationResponse.json()
        //this means that the user did not create the meal correctly
        //this should not occur as the fields will be checked before sending the body (this is just to give user feedback in case of weird edgecases)
        if(mealCreationBody.isError === true || mealCreationResponse.status === 415){
            alertManager("Some Fields are Missing!", "It seems like the Server didn't quite understand that. Are there maybe some fields you have missed?", "error")
            setRecipeIsSubmitted(false)
            return
        }

        //give user feedback in case of success
        if(mealCreationBody.isError === false || mealCreationResponse.status === 201){
            setRecipeIsSubmitted(false)
            alertManager("Created!", "Your Meal has been created! You may now view it in the 'Meals created by me' Tab!", 'success')
            return
        }
    }

    useEffect(() => {

    }, []);

    return (
        <Box className="editor-container">
            <link rel="stylesheet" type="text/css" href="/stylesheets/markdown.css" />
            <Stack direction="column">
                <h2>Metadata</h2>
                <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                    <GridItem>
                        <Stack direction="column">
                            <h4>Name</h4>
                            <Input id="name-field" isInvalid={invalidateName}></Input>
                        </Stack>
                    </GridItem>
                    <GridItem colSpan={2} />
                    <GridItem>
                        <Stack direction="column">
                            <h4>Image</h4>
                            <Center bgColor={invalidateImage} p="3" borderRadius="5px" overflowX="hidden" maxWidth="200px">
                                <input id="image-field" type="file" accept=".jpg, .png, jpeg, .webp, .svg"/>
                            </Center>
                        </Stack>
                    </GridItem>
                    <GridItem colSpan={2}>
                        <Stack direction="column">
                            <h4>Is it healthy?</h4>
                            <Select placeholder='Select option' bgColor="gray.500" color="black" id="healthyOption-field" width="5rem" isInvalid={invalidateHealthyOption}>
                                <option value='meat' style={{color:"black"}}>Meat</option>
                                <option value='vegetarian' style={{color:"black"}}>Vegetarian</option>
                                <option value='vegan' style={{color:"black"}}>Vegan</option>
                            </Select>
                        </Stack>
                    </GridItem>
                    <GridItem colSpan={1} />
                    <GridItem colSpan={1}>
                        <Stack>
                            <h4>How many persons?</h4>
                            <NumberInput isInvalid={invalidatePersons}>
                                <NumberInputField id="persons-field" />
                            </NumberInput>
                        </Stack>
                    </GridItem>
                </Grid>
                <h2>Ingredients</h2>
                {/*@ts-ignore*/}
                <Ingredients ingredientsObject={ingredients}/>
                <h2>Recipe</h2>
                <Box id="toolbar">
                    <Grid templateColumns="repeat(6, 1fr)">
                        <GridItem colSpan={1}>
                            <Center>
                                <Button colorScheme="purple" onClick={()=>{insertAtCursor('## This is a Heading')}}>
                                    Heading
                                </Button>
                            </Center>
                        </GridItem>
                        <GridItem>
                            <Center>
                                <Button colorScheme="purple" onClick={()=>{insertAtCursor('**your bold text here**')}}>
                                    <strong>B</strong>
                                </Button>
                            </Center>
                        </GridItem>
                        <GridItem>
                            <Center>
                            <Button colorScheme="purple" onClick={()=>{insertAtCursor('_your italic text here_')}}>
                                <em>I</em>
                            </Button>
                            </Center>
                        </GridItem>
                        <GridItem>
                            <Center>
                            <Button colorScheme="purple" onClick={()=>{insertAtCursor('- your bulletpoint here')}}>
                                <svg width="24" height="24" focusable="false"><path d="M11 5h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2ZM4.5 6c0-.4.1-.8.4-1 .3-.4.7-.5 1.1-.5.4 0 .8.1 1 .4.4.3.5.7.5 1.1 0 .4-.1.8-.4 1-.3.4-.7.5-1.1.5-.4 0-.8-.1-1-.4-.4-.3-.5-.7-.5-1.1Zm0 6c0-.4.1-.8.4-1 .3-.4.7-.5 1.1-.5.4 0 .8.1 1 .4.4.3.5.7.5 1.1 0 .4-.1.8-.4 1-.3.4-.7.5-1.1.5-.4 0-.8-.1-1-.4-.4-.3-.5-.7-.5-1.1Zm0 6c0-.4.1-.8.4-1 .3-.4.7-.5 1.1-.5.4 0 .8.1 1 .4.4.3.5.7.5 1.1 0 .4-.1.8-.4 1-.3.4-.7.5-1.1.5-.4 0-.8-.1-1-.4-.4-.3-.5-.7-.5-1.1Z" fill-rule="evenodd"></path></svg>
                            </Button>
                            </Center>
                        </GridItem>
                        <GridItem>
                            <Center>
                            <Button colorScheme="purple" onClick={()=>{insertAtCursor('[visible text](https://the.url.you.want.invalid)')}}>
                                🔗
                            </Button>
                            </Center>
                        </GridItem>
                        <GridItem>
                            <Center>
                            <Button isDisabled colorScheme="purple" onClick={()=>{insertAtCursor('![alternative text](https://the.image.you.want.invalid)')}}>
                                🖼️
                            </Button>
                            </Center>
                        </GridItem>
                    </Grid>
                </Box>
                <Textarea onChange={handleFieldUpdate}
                          id="editor-field"
                          borderWidth="1px"
                          borderRadius="5px"
                          borderColor="gray.500"
                          padding="5px"
                          paddingTop="10px"
                          isInvalid={invalidateRecipe}
                />
                <Box fontSize="10px" color="gray.500" marginTop="-2">Basic Markdown Syntax is supported</Box>
                <Center><Button isLoading = {recipeIsSubmitted} colorScheme="green" onClick={(e:any)=>handleSubmit(e)}>Create</Button></Center>
                <h3>Recipe Preview</h3>
                <Box dangerouslySetInnerHTML={{__html: renderedPreview}} />
            </Stack>
        </Box>
    )
}