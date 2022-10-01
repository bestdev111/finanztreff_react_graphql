import React, {useState} from "react";
import classNames from "classnames";
import {Card} from "react-bootstrap";
import ChartSignalCollapse from "./ChartSignalCollapse";

interface ChartSignalComponentProps {
    heading: string
    headingColor: string
}

export const ChartSignalComponent = ({heading, headingColor}: ChartSignalComponentProps) => {
    const [openOscillators, setOpenOscillators] = useState<boolean>(false);
    const [openTrendFollower, setOpenTrendFollower] = useState<boolean>(false);
    const [openCandlesticks, setOpenCandlesticks] = useState<boolean>(false);
    const [openTrendDeterminers, setOpenTrendDeterminers] = useState<boolean>(false);
    return(
        <Card className={"border-0 mt-3"}>
            <span className={classNames(headingColor, "text-white py-2 pl-2")}>{heading}</span>
            <div>
                <ChartSignalCollapse open={openOscillators} setOpen={() => setOpenOscillators(!openOscillators)} trendType={"Oszillatoren"}/>
                <ChartSignalCollapse open={openTrendFollower} setOpen={() => setOpenTrendFollower(!openTrendFollower)} trendType={"Trendfolger"}/>
                <ChartSignalCollapse open={openCandlesticks} setOpen={() => setOpenCandlesticks(!openCandlesticks)} trendType={"Candlesticks"}/>
                <ChartSignalCollapse  open={openTrendDeterminers} setOpen={() => setOpenTrendDeterminers(!openTrendDeterminers)} trendType={"Trendbestimmer"}/>
            </div>
        </Card>
    )
}

export default ChartSignalComponent
