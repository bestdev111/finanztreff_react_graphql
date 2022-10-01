import React from "react";

interface ChartSignalTableProps {
    todayValue: string
    weekValue: string
    name: string
}

export const ChartSignalTable = ({todayValue, weekValue, name}: ChartSignalTableProps) => {
    return(
        <tr style={{fontSize: 15}}>
            <td className={"text-blue px-0 pl-2 text-nowrap"}>{name}</td>
            <td className={"font-weight-bold text-right"}>{todayValue}</td>
            <td className={"font-weight-bold text-right"}>{weekValue}</td>
        </tr>
    )
}

export default ChartSignalTable
