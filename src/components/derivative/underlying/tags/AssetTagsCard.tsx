import React from "react";
import AssetTagsWrapper from "./AssetTagsWrapper";
import {useBootstrapBreakpoint} from "../../../../hooks/useBootstrapBreakpoint";

export default function AssetTagsCard(props: any) {

    const cardHeight = useBootstrapBreakpoint({
        default: "257px",
        md: "359px",
        xl: "257px",
    });
    return (<>
        <div className="col">
            <div className="derivate-big-card tags-card" style={{height:cardHeight}}>
                <AssetTagsWrapper  {...props}/>
            </div>
        </div>
    </>);
}
