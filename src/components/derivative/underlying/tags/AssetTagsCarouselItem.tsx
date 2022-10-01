import React from "react";
import AssetTagsWrapper from "./AssetTagsWrapper";

export default function AssetTagsCarouselItem(props: any) {
    return (<>
        <div className="tags-card">
            <AssetTagsWrapper {...props}/>
        </div>
    </>);
}
