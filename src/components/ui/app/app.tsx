import Editor from "@/components/ui/app/editor";
import CreatedByMe from "@/components/ui/app/createdByMe";
import {useEffect, useState} from "react";
export default function App ({selectedPage}:{selectedPage:"Editor" | "List" | "Recommended"}){
    const [currentPage, setCurrentPage] = useState(<Editor />)

    useEffect(() => {
        if(selectedPage == "Editor"){
            setCurrentPage(<Editor />)
        }
        else if(selectedPage == "List"){
            setCurrentPage(<CreatedByMe />)
        }
        else if(selectedPage == "Recommended"){
            setCurrentPage(<div>This could be a list of recommended Meals</div>)
        }
    }, [selectedPage]);
    return(
        <div>
            {currentPage}
        </div>
    )
}