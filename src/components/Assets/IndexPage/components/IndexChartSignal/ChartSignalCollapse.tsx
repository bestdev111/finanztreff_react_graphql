import React from "react";
import SvgImage from "../../../../common/image/SvgImage";
import {Collapse, Table} from "react-bootstrap";
import ChartSignalTable from "./ChartSignalTable";

interface ChartSignalCollapseProps {
    trendType: string
    open: boolean
    setOpen: (value: boolean) => void
}

export const ChartSignalCollapse = ({trendType, open, setOpen}: ChartSignalCollapseProps) => {
    return(
        <>
            <div className={"bg-border-gray d-flex justify-content-between font-weight-bold"} onClick={() => setOpen(!open)}>
                <span className={"pl-2 py-2 pt-3"}>{trendType}</span>
                <SvgImage spanClass="top-move py-1 mt-1" convert={false} icon="icon_direction_down_blue_light.svg"
                          imgClass="svg-blue" width={"33"}/>
            </div>
            <Collapse in={open}>
                <div>
                    <Table>
                        <tbody>
                        <tr>
                            <td/>
                            <td className={"text-right"}>Heute</td>
                            <td className={"text-right"}>Woche</td>
                        </tr>
                        <ChartSignalTable todayValue={"20"} weekValue={"228"} name={"Momentum schneidet Nulllinie"}/>
                        <ChartSignalTable todayValue={"--"} weekValue={"177"} name={"RSI überverkauft"}/>
                        <ChartSignalTable todayValue={"--"} weekValue={"47"} name={"Stochastik schneidet Signallinie"}/>
                        <ChartSignalTable todayValue={"3"} weekValue={"58"} name={"Stochastik überverkauft"}/>
                        </tbody>
                    </Table>
                </div>
            </Collapse>
        </>
    )
}

export default ChartSignalCollapse
