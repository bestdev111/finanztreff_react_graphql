import React, {useState} from "react";
import AssetRowTitle from "../common/AssetRowTitle";
import AssetMainInfo from "./AssetMainInfo";
import {AssetOtherInfo, AssetOtherInfoSm} from "./AssetOtherInfo";

export default function AssetCarouselItem(props: any) {
    const [dataLoaded, setDataLoaded] = useState<any>(null);

    return (<>
        <div className="top">
            <AssetRowTitle title={props.title} />
        </div>
        <div className="data-wrapper">
            <AssetMainInfo bottomInfo={props.bottomInfo} showTime={props.showTime} assetClassId={props.assetClassId}
                           type1={props.type1} type2={props.type2} homepage={true} groupId={props.groupId} onDataLoaded={(data: any) => setDataLoaded(data)}/>
            {
                dataLoaded &&
                <AssetOtherInfo className="d-none d-xl-block" title={props.otherTitle}
                                type1={props.type1 || 'call'} type2={props.type2 || 'put'} homepage={true}
                                assetClassId={props.assetClassId} assetClassName={props.assetClassName}
                                assetClassGroup={props.assetClassGroup}
                                underlyingInstrumentGroupId={props.groupId}
                                data={dataLoaded}
                />
            }
        </div>
    </>);
}
