import {Box, Center, Button, Stack, Grid, GridItem} from '@chakra-ui/react'
import './app.css'

export default function Layout({children}:{children: React.ReactNode}){
    return(
        <div>
            <Box className="app-sidebar">
                <Grid templateColumns="repeat(9, 1fr)" gap={4}>
                    <GridItem colSpan={3}>
                        <Button variant="ghost" color="purple" width="100%">
                            Purple
                        </Button>
                    </GridItem>
                    <GridItem colSpan={3}>
                        <Button variant="outline" color="purple" width="100%">
                            Purple
                        </Button>
                    </GridItem>
                    <GridItem colSpan={3}>
                        <Button variant="outline" color="purple" width="100%">
                            Purple
                        </Button>
                    </GridItem>
                </Grid>

            </Box>
            {children}
        </div>
    )
}