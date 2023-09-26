"use client"
import {Box, Center, Button, Stack, Grid, GridItem} from '@chakra-ui/react'
import Navbar from '@/components/ui/app/navbar'
import App from "@/components/ui/app/app";
import {useEffect, useState} from "react";
import { useSearchParams } from 'next/navigation'

export default function Layout({children}:{children: React.ReactNode}){
    const searchParams = useSearchParams()
    const [currentPage, setCurrentPage] = useState<"Editor" | "List" | "Recommended">('Editor')
    const [appState, setAppState] = useState(<App selectedPage={currentPage} /> )
    const handleClickNavbar = (e:any) =>{
        setCurrentPage(e.target.id)
        setAppState(<App selectedPage={e.target.id.toString()} />)
    }
    useEffect(() => {
        if(searchParams.get('selected') && searchParams.get('selected') == "Editor"){
            handleClickNavbar({target:{id:"Editor"}})
        }
        else if(searchParams.get('selected') && searchParams.get('selected') == "List"){
            handleClickNavbar({target:{id:"List"}})
        }
    }, []);
    return(
        <div>
            <link href="/stylesheets/app.css" type="text/css" rel="stylesheet" />
            <Navbar callbackFunction={handleClickNavbar}/>
            {appState}
        </div>
    )
}