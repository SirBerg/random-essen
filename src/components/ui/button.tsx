'use client'
import {Button} from "@chakra-ui/react";

export default function HomepageButton ({children, ...props}:any){
    return(
        <Button className="inverted-bg" variant="outline">
            {children}
        </Button>
    )
}

export function IconButton({children, ...props}:any){
    return(
        <Button variant="ghost">
            {children}
        </Button>
    )
}