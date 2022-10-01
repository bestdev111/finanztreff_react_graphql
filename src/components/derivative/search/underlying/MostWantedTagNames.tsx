import React from 'react'
import './UnderlyingTags.scss'


interface MostWantedTagNamesProps {
    assetName: string;
    name: string;
    change: string;
    value: string
}

export const MostWantedTagNames = (props: MostWantedTagNamesProps) => {
    return (
        <div className="most-wanted-wrapper m-2">
            <div className="bg-white most-wanted-tag p-1">
                <span className="text-blue font-weight-bold tag-asset-name">{props.assetName}</span>
                <br/>
                <span className="font-weight-bold">{props.name}</span>
                <div className="d-flex justify-content-between">
                    <span className="font-weight-lighter">{props.value}</span>
                    <span className="text-green">{props.change}</span>
                </div>
            </div>
        </div>
    )
}

export default MostWantedTagNames
