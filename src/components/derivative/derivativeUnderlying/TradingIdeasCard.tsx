import React from 'react'
import {Card} from "react-bootstrap";
import './TradingIdeasNew.scss'
import {formatColorOfAssetGroup} from "../../profile/utils";
import {formatAssetGroup} from "../../../utils";
import {AssetGroup} from "../../../generated/graphql";

interface TradingIdeasCardProps {
    heading: string
    description: string
    count: number
    assetGroup: AssetGroup | null | undefined;
}

export const TradingIdeasCard = ({count, description, assetGroup, heading}: TradingIdeasCardProps) => {
    return (
        <>
            <Card className = "p-3 mb-3 derivative-trading-idea-card border-0">
                <Card.Title>
                    <h5 className="news-title text-blue font-weight-bold" style={{fontSize: 18}}>
                        <a href={"/#"}>{heading}</a>
                    </h5>
                </Card.Title>
                <Card.Body>
                    <div className="text-gray mt-n5 pt-3 mr-n3 ml-n3 font-size-13px">
                        {description}
                    </div>
                </Card.Body>
                <div className="d-flex justify-content-between mt-n3 align-items-center">
                    <div className={"font-size-13px"}>
                        <span><strong>{count}</strong></span>
                        <span className="pl-2">Treffer</span>
                    </div>
                    <div>
                        <span className={"text-white font-size-12px pl-2 pt-1 pr-2 pb-1"}
                              style={{backgroundColor: formatColorOfAssetGroup(assetGroup)}}
                        >
                            {formatAssetGroup(assetGroup).toUpperCase()}
                        </span>
                    </div>
                </div>
            </Card>

        </>
    )
}

export default TradingIdeasCard
