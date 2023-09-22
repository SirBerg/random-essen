import {Box, Button, Center, Grid, GridItem, Select, Stack, Textarea} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import {Input} from "@chakra-ui/input";

import Ingredients from "@/components/ui/app/editor/ingredients";

export default function Editor(){
    const [fieldValue, setFieldValue] = useState("")

    const [ingredients, setIngredients] = useState({
        ingredients: []
    })

    const [renderedPreview, setRenderedPreview] = useState("")

    function insertAtCursor(value:string){

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
                            <Input></Input>
                        </Stack>
                    </GridItem>
                    <GridItem colSpan={2} />
                    <GridItem>
                        <Stack direction="column">
                            <h4>Image</h4>
                            <Center>
                                <input type="file" accept="image/png, image/jpeg, image/webp, svg"/>
                            </Center>
                        </Stack>
                    </GridItem>
                    <GridItem colSpan={2}>
                        <Stack direction="column">
                            <h4>Is it healthy?</h4>
                            <Select placeholder='Select option' bgColor="gray.500" color="black" id="healthyOption-input" width="5rem">
                                <option value='meat' style={{color:"black"}}>Meat</option>
                                <option value='vegetarian' style={{color:"black"}}>Vegetarian</option>
                                <option value='vegan' style={{color:"black"}}>Vegan</option>
                            </Select>
                        </Stack>
                    </GridItem>
                </Grid>
                <h2>Ingredients</h2>
                <Ingredients ingredientsObject={ingredients}/>
                <h2>Recipe</h2>
                <Box id="toolbar">
                    <Grid templateColumns="repeat(6, 1fr)">
                        <GridItem colSpan={1}>
                            <Center>
                                <Button colorScheme="purple" onClick={()=>{insertAtCursor('## This is an Heading')}}>
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
                            <Button colorScheme="purple" onClick={()=>{insertAtCursor('![alternative text](https://the.image.you.want.invalid)')}}>
                                🖼️
                            </Button>
                            </Center>
                        </GridItem>
                    </Grid>
                </Box>
                <Textarea onChange={handleFieldUpdate}
                          id="editor-field"
                          variant="unstyled"
                          borderWidth="1px"
                          borderRadius="5px"
                          borderColor="gray.500"
                          padding="5px"
                          paddingTop="10px"
                />
                <Box fontSize="10px" color="gray.500" marginTop="-2">Basic Markdown Syntax is supported</Box>
                <Center><Button colorScheme="green">Create</Button></Center>
                <h3>Recipe Preview</h3>
                <Box dangerouslySetInnerHTML={{__html: renderedPreview}} />
            </Stack>
        </Box>
    )
}