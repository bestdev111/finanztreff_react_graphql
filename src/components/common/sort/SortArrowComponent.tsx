import React from "react";

export interface SortArrowParameters {
    sortName: string,
    currentSortName?: string,
    sortDir: number, // 0 - UP; 1 - DOWN;
}

export function SortArrowComponent(props: SortArrowParameters) {
    return (
        <>
            {
                props.sortName.localeCompare(props.currentSortName || "") === 0 &&
                <span className={"svg-icon sort-arrow direction-"+(props.sortDir === 0 ? 'top':'bottom')}>
                    <img src="/static/img/svg/icon_arrow_long_right_dark.svg"></img>
                </span>
            }
        </>
    )
}
