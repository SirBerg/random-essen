import {Box, Center, Button, Stack, Grid, GridItem} from '@chakra-ui/react'
import './app.css'
import Navbar from '@/components/ui/app/navbar'
export default function Layout({children}:{children: React.ReactNode}){

    return(
        <div>
            <Navbar />
            {children}
        </div>
    )
}