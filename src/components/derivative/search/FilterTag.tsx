import React from 'react'
import { Link } from 'react-router-dom'
import './DerivativeTopSearch.scss'

interface FilterTagProps {
    tagName: string
    onClick?: () => any;
}

export const FilterTag = ({tagName, onClick}: FilterTagProps) => {
    return(
        <>
         <div className = "bg-white m-2 p-1 derivative-search-tags" style={{cursor: "pointer"}} onClick={() => {if(onClick) onClick()}}>
             {tagName}
         </div>
        </>
    )
}

export default FilterTag
