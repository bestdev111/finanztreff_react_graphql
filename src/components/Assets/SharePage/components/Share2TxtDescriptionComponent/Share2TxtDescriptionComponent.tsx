import React from "react";
import { InstrumentGroup } from "../../../../../generated/graphql";
import {inspect} from "util";
import {useBootstrapBreakpoint} from "../../../../../hooks/useBootstrapBreakpoint";

export interface Share2TxtDescriptionComponentProps {
    instrumentGroup: InstrumentGroup;
}

export const Share2TxtDescriptionComponent = (props: Share2TxtDescriptionComponentProps) => {

    if (!props.instrumentGroup.description?.natural) {
        return <></>;
    }
    return (
        <>
            <div className="content-wrapper">
                <div className="content">
                    {props.instrumentGroup.description.natural.length > 300 ? props.instrumentGroup.description.natural.slice(0,300) + "..." : props.instrumentGroup.description.natural}
                </div>
            </div>
        </>
    );
}
