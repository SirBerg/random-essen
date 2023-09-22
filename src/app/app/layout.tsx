import {Box, Center, Button, Stack, Grid, GridItem} from '@chakra-ui/react'
import Navbar from '@/components/ui/app/navbar'
export default function Layout({children}:{children: React.ReactNode}){

    return(
        <div>
            <link href="/stylesheets/app.css" type="text/css" rel="stylesheet" />
            <Navbar />
            {children}
        </div>
    )
}